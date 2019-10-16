package com.wazaby.android.wazaby.connInscript;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.design.widget.CoordinatorLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkError;
import com.android.volley.NoConnectionError;
import com.android.volley.ParseError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.ServerError;
import com.android.volley.TimeoutError;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.wazaby.android.wazaby.R;
import com.wazaby.android.wazaby.model.Const;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by bossmaleo on 25/08/17.
 */

public class forminscript2 extends AppCompatActivity{

    private Toolbar toolbar;
    private Resources res;
    private Button send;
    private String sexe;
    private EditText nom;
    private EditText prenom;
    private Intent intent;
    private RadioGroup monsexeradioGroup;
    private CoordinatorLayout coordinatorLayout;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.forminscript2);
        res = getResources();
        coordinatorLayout = (CoordinatorLayout)findViewById(R.id.coordinatorLayout);
        Animation anim = AnimationUtils.loadAnimation(this,R.anim.slide_in);
        findViewById(R.id.coordinatorLayout).startAnimation(anim);
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        send = (Button)findViewById(R.id.send);
        nom = (EditText)findViewById(R.id.nom);
        prenom = (EditText)findViewById(R.id.prenom);
        monsexeradioGroup = (RadioGroup) findViewById(R.id.monsexe);
        intent = getIntent();

        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(res.getString(R.string.inscript1_1));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (validate()==true) {
                    int radioButtonID = monsexeradioGroup.getCheckedRadioButtonId();
                    View radioButton = monsexeradioGroup.findViewById(radioButtonID);
                    int idx = monsexeradioGroup.indexOfChild(radioButton);
                    RadioButton r = (RadioButton) monsexeradioGroup.getChildAt(idx);
                    String selectedtext = r.getText().toString();
                    if (selectedtext.trim().equals("Masculin")) {
                        sexe = "H";
                    }else if (selectedtext.trim().equals("Feminin")) {
                        sexe = "F";
                    }
                    Intent intent1 = new Intent(getApplicationContext(),forinscript4.class);
                    intent1.putExtra("sexe",sexe);
                    intent1.putExtra("prenom",String.valueOf(prenom.getText()));
                    intent1.putExtra("nom",String.valueOf(nom.getText()));
                    intent1.putExtra("code",intent.getStringExtra("code"));
                    intent1.putExtra("email",intent.getStringExtra("email"));
                    startActivity(intent1);
                }
                /*int radioButtonID = monsexe.getCheckedRadioButtonId();
                View radioButton = monsexe.findViewById(radioButtonID);
                int idx = monsexe.indexOfChild(radioButton);
                RadioButton r = (RadioButton) monsexe.getChildAt(idx);
                String selectedtext = r.getText().toString();
                if (selectedtext.trim().equals("Masculin")) {
                    sexe = 'H';
                }else if (selectedtext.trim().equals("Feminin")) {
                    sexe = 'F';
                }

                String datedenaissanceLibelle;
                datedenaissanceLibelle = String.valueOf(naissance.getText()).split("/")[2]+"-"+String.valueOf(naissance.getText()).split("/")[1]+"-"+String.valueOf(naissance.getText()).split("/")[0];
                String url = Const.dns+"/WazzabyApi/public/api/insertUsers?nom="+
                        +"&prenom="++"&email="++"&codedevalidation="
                        ++"&sexe="+sexe+"&password="+String.valueOf(password.getText().toString())
                        +"&date="+datedenaissanceLibelle;
                pDialog = new ProgressDialog(forminscript2.this);
                pDialog.setMessage("Chargement en cours...");
                pDialog.setIndeterminate(false);
                pDialog.setCancelable(false);
                pDialog.show();
                CreateUser(url);*/
            }
        });
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                // User chose the "Settings" item, show the app settings UI...
                Intent i = new Intent();
                setResult(RESULT_OK, i);
                finish();
                return true;



            default:
                // If we got here, the user's action was not recognized.
                // Invoke the superclass to handle it.
                return super.onOptionsItemSelected(item);

        }
    }

    @Override
    public void onBackPressed() {
        Intent i = new Intent();
        setResult(RESULT_OK, i);
        finish();
    }


    public boolean validate() {
        boolean valid = true;
        String _nom  = nom.getText().toString();
        String _prenom = prenom.getText().toString();

        int radioButtonID = monsexeradioGroup.getCheckedRadioButtonId();
        View radioButton = monsexeradioGroup.findViewById(radioButtonID);
        int idx = monsexeradioGroup.indexOfChild(radioButton);
        RadioButton r = (RadioButton) monsexeradioGroup.getChildAt(idx);
        String selectedtext = r.getText().toString();

        if (selectedtext.trim().isEmpty()) {
            Toast.makeText(forminscript2.this,res.getString(R.string.inscript_sexe),Toast.LENGTH_LONG).show();
            valid = false;
        }

        if (_nom.isEmpty()) {
            nom.setError(res.getString(R.string.nom_error));
            valid = false;
        }else {
            nom.setError(null);
        }

        if (_prenom.isEmpty()) {
            prenom.setError(res.getString(R.string.prenom_error));
            valid = false;
        }else {
            prenom.setError(null);
        }


        return valid;
    }




}
