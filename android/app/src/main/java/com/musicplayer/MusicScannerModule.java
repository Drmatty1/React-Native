package com.musicplayer;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class MusicScannerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public MusicScannerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MusicScanner";
    }

    @ReactMethod
    public void scanAudioFiles(Promise promise) {
        WritableArray audioList = Arguments.createArray();
        ContentResolver contentResolver = reactContext.getContentResolver();
        Uri collection = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;

        String[] projection = {
                MediaStore.Audio.Media._ID,
                MediaStore.Audio.Media.TITLE,
                MediaStore.Audio.Media.ARTIST,
                MediaStore.Audio.Media.ALBUM,
                MediaStore.Audio.Media.ALBUM_ID,
                MediaStore.Audio.Media.DURATION,
                MediaStore.Audio.Media.SIZE,
                MediaStore.Audio.Media.DATE_ADDED,
                MediaStore.Audio.Media.TRACK,
                MediaStore.Audio.Media.DATA
        };

        String selection = MediaStore.Audio.Media.IS_MUSIC + " != 0 AND " +
                           MediaStore.Audio.Media.DURATION + " > 15000";

        String sortOrder = MediaStore.Audio.Media.TITLE + " ASC";

        try (Cursor cursor = contentResolver.query(collection, projection, selection, null, sortOrder)) {
            if (cursor != null) {
                while (cursor.moveToNext()) {
                    long id = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID));
                    long albumId = cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID));
                    Uri contentUri = ContentUris.withAppendedId(collection, id);

                    WritableMap song = Arguments.createMap();
                    song.putString("id", String.valueOf(id));
                    song.putString("albumId", String.valueOf(albumId));
                    song.putString("uri", contentUri.toString());
                    
                    song.putString("title", cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)));
                    song.putString("artist", cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)));
                    song.putString("album", cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)));
                    song.putString("path", cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)));

                    song.putDouble("duration", cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)));
                    song.putDouble("size", cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)));
                    song.putDouble("dateAdded", cursor.getLong(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)));
                    song.putInt("trackNumber", cursor.getInt(cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TRACK)));

                    Uri artworkUri = ContentUris.withAppendedId(
                            Uri.parse("content://media/external/audio/albumart"),
                            albumId
                    );
                    song.putString("artwork", artworkUri.toString());

                    audioList.pushMap(song);
                }
            }
            promise.resolve(audioList);

        } catch (Exception e) {
            promise.reject("MUSIC_SCAN_ERROR", e);
        }
    }

}
