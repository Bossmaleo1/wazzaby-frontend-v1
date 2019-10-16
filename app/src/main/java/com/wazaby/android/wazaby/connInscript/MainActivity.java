package com.wazaby.android.wazaby.connInscript;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.wazaby.android.wazaby.R;
import com.wazaby.android.wazaby.appviews.Home;
import com.wazaby.android.wazaby.model.Database.SessionManager;
import com.wazaby.android.wazaby.model.dao.DatabaseHandler;
import com.wazaby.android.wazaby.model.data.Profil;

public class MainActivity extends AppCompatActivity {

    private SessionManager session;
    private RelativeLayout block;
    private Profil user;
    private DatabaseHandler database;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        block = findViewById(R.id.block);
        database = new DatabaseHandler(this);
        session = new SessionManager(this);
        if(!String.valueOf(session.getUserDetail().get(SessionManager.Key_ID)).equals("null"))
        {
            user = database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID)));
        }

        Thread background = new Thread() {
            public void run() {

                try {

                    sleep(3*1000);
                    if(!session.IsLoggedIn()) {
                        Intent i = new Intent(getApplicationContext(), Connexion.class);
                        startActivity(i);
                    }else
                    {
                        if(user.getIDPROB().equals("yoyo"))
                        {
                            Intent i = new Intent(getApplicationContext(), ProblematiqueConnexion.class);
                            startActivity(i);
                        }else {
                            Intent i = new Intent(getApplicationContext(), Home.class);
                            startActivity(i);
                        }
                    }
                    finish();

                } catch (Exception e) {

                }
            }
        };

        background.start();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);//***Change Here***
        startActivity(intent);
        finish();
        System.exit(0);
    }
}
