package com.wazaby.android.wazaby.appviews;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.wazaby.android.wazaby.R;

import hani.momanii.supernova_emoji_library.Actions.EmojIconActions;
import hani.momanii.supernova_emoji_library.Helper.EmojiconEditText;

public class Test extends AppCompatActivity {

    private static final String TAG = Test.class.getSimpleName();
    EmojiconEditText emojiconEditText;
    ImageView emojiImageView;
    View rootView;
    EmojIconActions emojIcon;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.test);
    rootView = findViewById(R.id.root_view);
    emojiImageView = (ImageView) findViewById(R.id.emoji_btn);
    emojiconEditText = (EmojiconEditText) findViewById(R.id.textArea_information);
    emojIcon = new EmojIconActions(this, rootView, emojiconEditText, emojiImageView);
        emojIcon.ShowEmojIcon();
        emojIcon.setIconsIds(R.drawable.ic_action_keyboard, R.drawable.smiley);
        emojIcon.setKeyboardListener(new EmojIconActions.KeyboardListener() {
        @Override
        public void onKeyboardOpen() {
            Log.e(TAG, "Keyboard opened!");
        }

        @Override
        public void onKeyboardClose() {
            Log.e(TAG, "Keyboard closed");
        }
    });
}
}
