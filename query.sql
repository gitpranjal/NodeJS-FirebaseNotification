select NOTIF_MSG, NOTIF_DATE, ANDROID_TOKEN, IOS_TOKEN, user_id, NOTIF_ID from NOTIFICATION_MT t1 
JOIN core_USER_mt t2 on t1.RECEIVER_ID = t2.user_id
where ANDROID_TOKEN is not null or IOS_TOKEN is not null

