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
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
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
import com.wazaby.android.wazaby.appviews.Home;
import com.wazaby.android.wazaby.model.Const;
import com.wazaby.android.wazaby.model.Database.SessionManager;
import com.wazaby.android.wazaby.model.dao.DatabaseHandler;
import com.wazaby.android.wazaby.model.data.Profil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

public class forinscript4 extends AppCompatActivity {

    private ProgressDialog pDialog;
    private Toolbar toolbar;
    private int day;
    private int month;
    private int year;
    private Intent intent;
    private Button send;
    private TextView naissance;
    private LinearLayout naissance_block;
    static final int DATE_DIALOG_ID = 999;

    private EditText password;
    private EditText password2;
    private Resources res;
    private CoordinatorLayout coordinatorLayout;
    private SessionManager session;
    private DatabaseHandler database;
    private JSONObject reponse;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.forminscript4);
        res = getResources();
        Animation anim = AnimationUtils.loadAnimation(this,R.anim.slide_in);
        findViewById(R.id.coordinatorLayout).startAnimation(anim);
        coordinatorLayout = (CoordinatorLayout)findViewById(R.id.coordinatorLayout);
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        naissance = (TextView) findViewById(R.id.naissance2);
        naissance_block = (LinearLayout) findViewById(R.id.naissance_block);
        password = (EditText)findViewById(R.id.password);
        password2 = (EditText)findViewById(R.id.password2);
        send = (Button)findViewById(R.id.send);
        addListenerOnButton();
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle(res.getString(R.string.inscript1_3));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        /*getSupportActionBar().setTitle(res.getString(R.string.inscript1_1));
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);*/
        setCurrentDateOnView();
        intent = getIntent();
        session = new SessionManager(this);

        //setTheme(android.R.style.Theme);
        //Instanciata de la classe DatabaseHandler
        database = new DatabaseHandler(this);
        send.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (validate()==true) {
                    pDialog = new ProgressDialog(forinscript4.this);
                    pDialog.setMessage("Chargement en cours...");
                    pDialog.setIndeterminate(false);
                    pDialog.setCancelable(false);
                    pDialog.show();
                    String datedenaissanceLibelle;
                    datedenaissanceLibelle = String.valueOf(naissance.getText()).split("/")[2]+"-"+String.valueOf(naissance.getText()).split("/")[1]+"-"+String.valueOf(naissance.getText()).split("/")[0];
                    String url = Const.dns+"/WazzabyApi/public/api/insertUsers?nom="+intent.getStringExtra("nom")
                            +"&prenom="+intent.getStringExtra("prenom")+"&email="+intent.getStringExtra("email")+"&codedevalidation="
                            +intent.getStringExtra("code")+"&sexe="+intent.getStringExtra("sexe")+"&password="+String.valueOf(password.getText().toString())
                            +"&date="+datedenaissanceLibelle;
                    CreateUser(url);
                }

            }
        });
    }


    private void CreateUser(final String create_user_url)
    {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, create_user_url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        pDialog.dismiss();
                        showJSON(response);
                        String url92 = Const.dns.concat("/WazzabyApiOthers/send_welcome_mail.php?password=")
                                .concat(String.valueOf(password.getText().toString())).concat("&email=")
                                .concat(intent.getStringExtra("email")).concat("&sexe=").concat(intent.getStringExtra("sexe"))
                                .concat("&prenom=").concat(intent.getStringExtra("prenom")).concat("&nom=").concat(intent.getStringExtra("nom"));
                        SendMessage(url92);
                        Toast.makeText(forinscript4.this, "Votre Inscription s'est effectuer avec succes !!" , Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(getApplicationContext(),UploadImage.class);
                        startActivity(intent);
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        pDialog.dismiss();

                        if(error instanceof ServerError)
                        {
                            Toast.makeText(forinscript4.this,"Une erreur au niveau du serveur viens de survenir ",Toast.LENGTH_LONG).show();
                        }else if(error instanceof NetworkError)
                        {
                            Toast.makeText(forinscript4.this,"Une erreur  du réseau viens de survenir ",Toast.LENGTH_LONG).show();
                        }else if(error instanceof AuthFailureError)
                        {
                            Toast.makeText(forinscript4.this,"Une erreur d'authentification réseau viens de survenir ",Toast.LENGTH_LONG).show();
                        }else if(error instanceof ParseError)
                        {
                            Toast.makeText(forinscript4.this,"Une erreur  du réseau viens de survenir ",Toast.LENGTH_LONG).show();
                        }else if(error instanceof NoConnectionError)
                        {
                            Toast.makeText(forinscript4.this,"Une erreur  du réseau viens de survenir, veuillez revoir votre connexion internet ",Toast.LENGTH_LONG).show();
                        }else if(error instanceof TimeoutError)
                        {
                            Toast.makeText(forinscript4.this,"Le delai d'attente viens d'expirer,veuillez revoir votre connexion internet ! ",Toast.LENGTH_LONG).show();
                        }else
                        {
                            Toast.makeText(forinscript4.this,"Une erreur  du réseau viens de survenir ",Toast.LENGTH_LONG).show();
                        }
                    }
                }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                return params;
            }

        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    @Override
    protected Dialog onCreateDialog(int id) {
        switch (id) {
            case DATE_DIALOG_ID:
                // set date picker as current date
                return new DatePickerDialog(this, datePickerListener,
                        year, month,day);
        }
        return null;
    }

    private DatePickerDialog.OnDateSetListener datePickerListener
            = new DatePickerDialog.OnDateSetListener() {

        // when dialog box is closed, below method will be called.
        public void onDateSet(DatePicker view, int selectedYear,
                              int selectedMonth, int selectedDay) {
            year = selectedYear;
            month = selectedMonth+1;
            day = selectedDay;

            if(month>9 && day>9) {
                naissance.setText(day + "/" + month + "/" + year);
            }else if(day<9 && month>9)
            {
                naissance.setText("0"+day + "/" + month + "/" + year);
            }else if(month<9 && day>9)
            {
                naissance.setText(day + "/0" + month + "/" + year);
            }
            else if(month<9 && day<9)
            {
                naissance.setText("0"+day + "/0" + month + "/" + year);
            }
        }
    };

    //ajouter la boîte de dialogue Calendrier
    public void addListenerOnButton() {


        naissance_block.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                showDialog(DATE_DIALOG_ID);

            }

        });
    }

    public void setCurrentDateOnView() {
        final Calendar c = Calendar.getInstance();
        year = c.get(Calendar.YEAR);
        month = c.get(Calendar.MONTH);
        day = c.get(Calendar.DAY_OF_MONTH);
    }

    public boolean validate() {
        boolean valid = true;

        String _password2 = password2.getText().toString();
        String _password = password.getText().toString();

        if (_password2.isEmpty()) {
            password2.setError(res.getString(R.string.password_error4));
            valid = false;
        } else {
            password2.setError(null);
        }

        if (_password.isEmpty()) {
            password.setError(res.getString(R.string.password_error4));
            valid = false;
        }else {
            password.setError(null);
        }

        if (_password.length()<8) {
            password.setError(res.getString(R.string.password_error2));
            valid = false;
        }else {
            password.setError(null);
        }

        if(!String.valueOf(_password.trim()).equals(String.valueOf(_password2.trim()))) {
            password2.setError(res.getString(R.string.password_error3));
            valid = false;
        } else {
            password2.setError(null);
        }


        return valid;
    }

    @Override
    public void onBackPressed() {
        Intent i = new Intent();
        setResult(RESULT_OK, i);
        finish();
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


    private void SendMessage(final String create_user_url)
    {
        StringRequest stringRequest = new StringRequest(Request.Method.GET, create_user_url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                    }
                }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                return params;
            }

        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    public void showJSON(String response)
    {
        try {
            reponse = new JSONObject(response);
            session.createLoginSession(reponse.getInt("id"));
            /*Profil profil = new Profil(reponse.getInt("id"),reponse.getString("nom")
                        ,reponse.getString("prenom"),reponse.getString("datenaissance")
                        ,reponse.getString("sexe"),reponse.getString("email"),
                        reponse.getString("photo"),reponse.getString("keypush")//ici c'est le keypush, il va falloir l'ajouter sur le script php et ajouter libelle prob
                        ,reponse.getString("langue"),reponse.getString("etat")
                        ,reponse.getString("pays"),reponse.getString("ville")
                        ,"yoyo"
                        ,"yoyo");*/
            Profil profil = new Profil(reponse.getInt("id"),intent.getStringExtra("nom")
                    ,intent.getStringExtra("prenom"),String.valueOf(naissance.getText()).split("/")[2]+"-"+String.valueOf(naissance.getText()).split("/")[1]+"-"+String.valueOf(naissance.getText()).split("/")[0]
                    ,intent.getStringExtra("sexe"),intent.getStringExtra("email"),
                    "yo","yoyo"//ici c'est le keypush, il va falloir l'ajouter sur le script php et ajouter libelle prob
                    ,"yoyo","yoyo"
                    ,"yoyo","yoyo"
                    ,"yoyo"
                    ,"yoyo");
            database.addUSER(profil);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

}
