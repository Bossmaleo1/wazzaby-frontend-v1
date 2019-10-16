package com.wazaby.android.wazaby.connInscript;

import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;

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
import com.wazaby.android.wazaby.adapter.categorieProbAdapter;
import com.wazaby.android.wazaby.appviews.AddProblematique;
import com.wazaby.android.wazaby.appviews.CategorieProblematique;
import com.wazaby.android.wazaby.fragments.Problematique;
import com.wazaby.android.wazaby.model.Const;
import com.wazaby.android.wazaby.model.dao.DatabaseHandler;
import com.wazaby.android.wazaby.model.data.Categorie_prob;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProblematiqueConnexion extends AppCompatActivity {

    private RecyclerView recyclerView;
    private categorieProbAdapter allUsersAdapter;
    private List<Categorie_prob> data = new ArrayList<>();
    private ProgressBar progressBar;
    private JSONObject object;
    private CoordinatorLayout coordinatorLayout;
    private Snackbar snackbar;
    private Resources res;
    private DatabaseHandler database;
    private FloatingActionButton fab;
    private EditText searchview;
    private String max_request="0";
    private Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.categorieproblematique);

        recyclerView =  findViewById(R.id.my_recycler_view);
        searchview = findViewById(R.id.searchview);
        progressBar = findViewById(R.id.progressbar);
        toolbar =  findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setTitle("Problematiques");
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        coordinatorLayout = (CoordinatorLayout) findViewById(R.id.coordinatorLayout);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        res = getResources();
        database = new DatabaseHandler(this);

        allUsersAdapter = new categorieProbAdapter(this, data);
        recyclerView.addItemDecoration(new DividerItemDecoration(this, LinearLayoutManager.VERTICAL));
        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.setAdapter(allUsersAdapter);
        fab = (FloatingActionButton)findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(), AddProblematique.class);
                startActivity(intent);
            }
        });
        ConnexionProblematique();
        recyclerView.addOnItemTouchListener(new ProblematiqueConnexion.RecyclerTouchListener(this, recyclerView, new ProblematiqueConnexion.ClickListener() {
            @Override
            public void onClick(View view, int position) {
                Intent intent = new Intent(getApplicationContext(), CategorieProblematique.class);
                intent.putExtra("IDCAT", String.valueOf(data.get(position).getID()));
                intent.putExtra("TITLE", String.valueOf(data.get(position).getLibelle()));
                startActivity(intent);
            }

            @Override
            public void onLongClick(View view, int position) {

            }
        }));
    }

    private void ConnexionProblematique()
    {
        progressBar.setVisibility(View.VISIBLE);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, Const.dns+"/WazzabyApi/public/api/displayAllcatprob",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        //Toast.makeText(getActivity(),response,Toast.LENGTH_LONG).show();
                        try {
                            JSONArray reponse = new JSONArray(response);
                            for(int i = 0;i<reponse.length();i++)
                            {
                                object = reponse.getJSONObject(i);
                                max_request = String.valueOf(object.getInt("ID"));
                                data.add(new Categorie_prob(object.getInt("ID"), object.getString("Libelle")));
                            }


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        progressBar.setVisibility(View.GONE);
                        searchview.setVisibility(View.VISIBLE);
                        allUsersAdapter.notifyDataSetChanged();
                        //recursive();

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                        if(error instanceof ServerError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_servererror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else if(error instanceof NetworkError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_servererror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else if(error instanceof AuthFailureError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_servererror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else if(error instanceof ParseError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_servererror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else if(error instanceof NoConnectionError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_noconnectionerror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else if(error instanceof TimeoutError)
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_timeouterror), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });
                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }else
                        {
                            snackbar = Snackbar
                                    .make(coordinatorLayout, res.getString(R.string.error_volley_error), Snackbar.LENGTH_LONG)
                                    .setAction(res.getString(R.string.try_again), new View.OnClickListener() {
                                        @Override
                                        public void onClick(View view) {
                                            ConnexionProblematique();
                                        }
                                    });

                            snackbar.show();
                            progressBar.setVisibility(View.GONE);
                        }
                    }
                }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                params.put("ID","0");
                return params;
            }

        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    public static interface ClickListener {
        public void onClick(View view, int position);

        public void onLongClick(View view, int position);
    }

    static class RecyclerTouchListener implements RecyclerView.OnItemTouchListener {

        private GestureDetector gestureDetector;
        private ProblematiqueConnexion.ClickListener clickListener;

        public RecyclerTouchListener(Context context, final RecyclerView recyclerView, final ProblematiqueConnexion.ClickListener clickListener) {
            this.clickListener = clickListener;
            gestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {
                @Override
                public boolean onSingleTapUp(MotionEvent e) {
                    return true;
                }

                @Override
                public void onLongPress(MotionEvent e) {
                    View child = recyclerView.findChildViewUnder(e.getX(), e.getY());
                    if (child != null && clickListener != null) {
                        clickListener.onLongClick(child, recyclerView.getChildPosition(child));
                    }
                }
            });
        }

        @Override
        public boolean onInterceptTouchEvent(RecyclerView rv, MotionEvent e) {

            View child = rv.findChildViewUnder(e.getX(), e.getY());
            if (child != null && clickListener != null && gestureDetector.onTouchEvent(e)) {
                clickListener.onClick(child, rv.getChildPosition(child));
            }
            return false;
        }

        @Override
        public void onTouchEvent(RecyclerView rv, MotionEvent e) {
        }

        @Override
        public void onRequestDisallowInterceptTouchEvent(boolean disallowIntercept) {

        }


    }



}
