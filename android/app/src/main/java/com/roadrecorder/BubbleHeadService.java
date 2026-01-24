package com.roadrecorder;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;

public class BubbleHeadService extends Service {
    public static final String ACTION_CLOSE_WITH_ANIMATION = "ACTION_CLOSE_WITH_ANIMATION";

    private WindowManager windowManager;
    private View floatingView;

    @Override
    public void onCreate() {
        super.onCreate();

        floatingView = LayoutInflater.from(this).inflate(R.layout.bubble_head, null);

        int layoutFlag;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutFlag = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutFlag = WindowManager.LayoutParams.TYPE_PHONE;
        }

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutFlag,
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                        | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                        | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT
        );

        params.gravity = Gravity.TOP | Gravity.START;
        params.x = 100;
        params.y = 50;

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        windowManager.addView(floatingView, params);

        // Animate the bubble: fade + scale in
        floatingView.setAlpha(0f);
        floatingView.setScaleX(0f);
        floatingView.setScaleY(0f);
        floatingView.animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(400)
                .setInterpolator(new android.view.animation.AccelerateDecelerateInterpolator())
                .withEndAction(() -> startPulseAnimation(floatingView))
                .start();


        // Touch listener for dragging and gesture detection
        floatingView.findViewById(R.id.bubble_icon).setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;
            private long touchStartTime;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        touchStartTime = System.currentTimeMillis();
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();

                        // Reset scale to normal on new touch down
                        floatingView.animate()
                                .scaleX(1f)
                                .scaleY(1f)
                                .setDuration(200)
                                .start();

                        return true;

                    case MotionEvent.ACTION_MOVE:
                        params.x = initialX + (int) (event.getRawX() - initialTouchX);
                        params.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingView, params);
                        return true;

                    case MotionEvent.ACTION_UP:
                        float dx = Math.abs(event.getRawX() - initialTouchX);
                        float dy = Math.abs(event.getRawY() - initialTouchY);
                        long duration = System.currentTimeMillis() - touchStartTime;

                        if (dx < 10 && dy < 10 && duration < 200) {
                            // Considered a click
                            v.performClick();
                        } else {
                            // Snap to nearest edge
                            DisplayMetrics displayMetrics = new DisplayMetrics();
                            windowManager.getDefaultDisplay().getMetrics(displayMetrics);

                            int screenWidth = displayMetrics.widthPixels;
                            int centerX = screenWidth / 2;

                            // Animate to left or right edge
                            final int targetX = (params.x >= centerX) ? (screenWidth - floatingView.getWidth()) : 0;

                            ValueAnimator animator = ValueAnimator.ofInt(params.x, targetX);
                            animator.setDuration(250);
                            animator.addUpdateListener(animation -> {
                                params.x = (int) animation.getAnimatedValue();
                                windowManager.updateViewLayout(floatingView, params);
                            });
                            animator.start();
                        }
                        return true;
                }
                return false;
            }
        });

        // Click listener to open app
        floatingView.findViewById(R.id.bubble_icon).setOnClickListener(v -> {
            Intent intent = new Intent(BubbleHeadService.this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                    | Intent.FLAG_ACTIVITY_CLEAR_TOP
                    | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            startActivity(intent);

            // Notify ForegroundService that app is now foreground
            Intent serviceIntent = new Intent(
                    BubbleHeadService.this,
                    ForegroundService.class
            );
            serviceIntent.setAction(ForegroundService.ACTION_APP_OPENED_FROM_BUBBLE);
            startService(serviceIntent);
        });
    }

    private void startPulseAnimation(View targetView) {
        ObjectAnimator scaleX = ObjectAnimator.ofFloat(targetView, "scaleX", 1f, 1.12f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(targetView, "scaleY", 1f, 1.12f);

        scaleX.setDuration(1000);
        scaleY.setDuration(1000);

        scaleX.setRepeatCount(ValueAnimator.INFINITE);
        scaleY.setRepeatCount(ValueAnimator.INFINITE);

        scaleX.setRepeatMode(ValueAnimator.REVERSE);
        scaleY.setRepeatMode(ValueAnimator.REVERSE);

        scaleX.start();
        scaleY.start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_CLOSE_WITH_ANIMATION.equals(intent.getAction())) {
            if (floatingView != null && floatingView.isAttachedToWindow()) {
                floatingView.animate()
                        .alpha(0f)
                        .scaleX(0f)
                        .scaleY(0f)
                        .setDuration(300)
                        .withEndAction(() -> {
                            try {
                                // Ensure view is fully invisible before removing
                                floatingView.setVisibility(View.GONE);
                                windowManager.removeView(floatingView);
                                floatingView = null;
                            } catch (Exception ignored) {
                            }

                            stopSelf();
                        })
                        .start();
            } else {
                stopSelf();
            }

            return START_NOT_STICKY;
        }

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingView != null) windowManager.removeView(floatingView);
    }
}