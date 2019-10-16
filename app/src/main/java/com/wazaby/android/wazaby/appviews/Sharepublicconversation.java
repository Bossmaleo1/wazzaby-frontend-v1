package com.wazaby.android.wazaby.appviews;

import android.Manifest;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
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
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.wazaby.android.wazaby.R;
import com.wazaby.android.wazaby.connInscript.AndroidMultiPartEntity;
import com.wazaby.android.wazaby.connInscript.ImagePickerActivity;
import com.wazaby.android.wazaby.model.Const;
import com.wazaby.android.wazaby.model.Database.SessionManager;
import com.wazaby.android.wazaby.model.dao.DatabaseHandler;
import com.wazaby.android.wazaby.model.data.Profil;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import hani.momanii.supernova_emoji_library.Actions.EmojIconActions;
import hani.momanii.supernova_emoji_library.Helper.EmojiconEditText;

import static android.support.v4.content.FileProvider.getUriForFile;

/**
 * Created by bossmaleo on 19/11/17.
 */

public class Sharepublicconversation extends AppCompatActivity {

    private Toolbar toolbar;
    private Resources res;
    private ProgressDialog pDialog;
    private DatabaseHandler database;
    private SessionManager session;
    private String LIBELLE;
    private EmojiconEditText editText;
    private ImageView image_cancel;
    private ImageView image_post;
    private LinearLayout imageblock;
    public static final int REQUEST_GALLERY_IMAGE = 1;
    public static final int REQUEST_IMAGE_CAPTURE = 0;
    public static String fileName;
    private static final String TAG = Sharepublicconversation.class.getSimpleName();
    EmojiconEditText emojiconEditText;
    ImageView emojiImageView;
    View rootView;
    EmojIconActions emojIcon;
    private ImageView image_view;
    private ImageView icon_cancel_image_view;
    File sourceFile;
    private String name_file;
    private String extension;
    private String id_messagepublic;
    private String ID_photo;
    private JSONObject reponse;
    private JSONObject data;
    private String etat;
    private boolean status = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.sharepublicconversation);
        res = getResources();
        toolbar =  findViewById(R.id.toolbar);
        editText = findViewById(R.id.textArea_information);
        image_cancel = findViewById(R.id.image_cancel);
        image_post = findViewById(R.id.image_view);
        imageblock = findViewById(R.id.imageblock);
        this.etat = "1";
        this.status = false;
        //view1 = findViewById(R.id.view1);
        setSupportActionBar(toolbar);
        Drawable maleoIcon = res.getDrawable(R.drawable.ic_close_black_24dp);
        maleoIcon.mutate().setColorFilter(Color.rgb(255, 255, 255), PorterDuff.Mode.SRC_IN);
        getSupportActionBar().setTitle("");
        this.getSupportActionBar().setHomeAsUpIndicator(maleoIcon);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        database = new DatabaseHandler(this);
        session = new SessionManager(getApplicationContext());

        rootView = findViewById(R.id.root_view);
        emojiImageView = (ImageView) findViewById(R.id.emoji_btn);
        emojiconEditText = (EmojiconEditText) findViewById(R.id.textArea_information);
        emojIcon = new EmojIconActions(this, rootView, emojiconEditText, emojiImageView);
        emojIcon.ShowEmojIcon();
        emojIcon.setIconsIds(R.drawable.ic_action_keyboard, R.drawable.smiley);
        icon_cancel_image_view = findViewById(R.id.image_cancel);
        image_view = findViewById(R.id.image_view);
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_send, menu);
        MenuItem favoriteItem = menu.findItem(R.id.send);
        MenuItem favoriteItem1 = menu.findItem(R.id.add_picture);
        MenuItem favoriteItem2 = menu.findItem(R.id.insert_picture);
        Drawable newIcon = (Drawable)favoriteItem.getIcon();
        Drawable newIcon1 = (Drawable)favoriteItem1.getIcon();
        Drawable newIcon2 = (Drawable)favoriteItem2.getIcon();
        newIcon.mutate().setColorFilter(Color.rgb(255, 255, 255), PorterDuff.Mode.SRC_IN);
        newIcon1.mutate().setColorFilter(Color.rgb(255, 255, 255), PorterDuff.Mode.SRC_IN);
        newIcon2.mutate().setColorFilter(Color.rgb(255, 255, 255), PorterDuff.Mode.SRC_IN);
        favoriteItem.setIcon(newIcon);
        favoriteItem1.setIcon(newIcon1);
        favoriteItem2.setIcon(newIcon2);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                // User chose the "Settings" item, show the app settings UI...
                /*Intent i = new Intent(getApplicationContext(),Home.class);
                startActivity(i);
                finish();*/
                Intent i = new Intent();
                setResult(RESULT_OK, i);
                finish();
                return true;
            case R.id.send :
                LIBELLE = editText.getText().toString();
                pDialog = new ProgressDialog(Sharepublicconversation.this);
                pDialog.setMessage(res.getString(R.string.chargement));
                pDialog.setIndeterminate(false);
                pDialog.setCancelable(false);
                pDialog.show();
                if(status) {
                    Connexion();
                }else {
                    RequeteFinale();
                }
                return true;
            case R.id.add_picture:
                Dexter.withActivity(this)
                        .withPermissions(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        .withListener(new MultiplePermissionsListener() {
                            @Override
                            public void onPermissionsChecked(MultiplePermissionsReport report) {
                                if (report.areAllPermissionsGranted()) {
                                    takeCameraImage();
                                    //GalleryTakeImagePickerOptions();
                                }

                                if (report.isAnyPermissionPermanentlyDenied()) {
                                    showSettingsDialog();
                                }
                            }

                            @Override
                            public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                                token.continuePermissionRequest();
                            }
                        }).check();
                return true;
            case R.id.insert_picture:
                Dexter.withActivity(this)
                        .withPermissions(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        .withListener(new MultiplePermissionsListener() {
                            @Override
                            public void onPermissionsChecked(MultiplePermissionsReport report) {
                                if (report.areAllPermissionsGranted()) {
                                    chooseImageFromGallery();
                                    //GalleryTakeImagePickerOptions();
                                }

                                if (report.isAnyPermissionPermanentlyDenied()) {
                                    showSettingsDialog();
                                }
                            }

                            @Override
                            public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                                token.continuePermissionRequest();
                            }
                        }).check();
                return true;
            default:
                // If we got here, the user's action was not recognized.
                // Invoke the superclass to handle it.
                return super.onOptionsItemSelected(item);

        }
    }

    private void Connexion()
    {
        String urlrecuperefile = Const.dns.concat("/WazzabyApi/public/api/photomessagepublic?file_extension=").concat(extension).concat("&id_user=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getID())).concat("&id_problematique=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB()));
        //String  url = Const.dns.concat("/WazzabyApi/public/api/SaveMessagePublic?etat=").concat(this.etat).concat("&libelle=").concat(LIBELLE).concat("&id_problematique=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB()).concat('&ID=').concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getID())).concat("&id_message_public=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, urlrecuperefile,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        //pDialog.dismiss();
                        showJSON(response);
                        new UploadFileToServer().execute();
                       // RequeteFinale();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        pDialog.dismiss();

                        if(error instanceof ServerError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_servererror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof NetworkError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof AuthFailureError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof ParseError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof NoConnectionError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof TimeoutError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else
                        {

                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }
                    }
                }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                //params.put("ID_EME",);
                //params.put("IDProb",String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB()));
                //params.put("LIBELLE",LIBELLE);
                return params;
            }

        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    private void showSettingsDialog() {
        //AlertDialog.Builder builder = new AlertDialog.Builder(Sharepublicconversation.this);
        AlertDialog.Builder dialog = new AlertDialog.Builder(Sharepublicconversation.this);
        dialog.setCancelable(false);
        dialog.setTitle("Permissions");
        dialog.setMessage("Etes vous sure de supprimer cette permission ?" );
        dialog.setPositiveButton("Supprimer", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int id) {
                dialog.cancel();
                openSettings();
            }
        })
                .setNegativeButton("Annuler ", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Action for "Cancel".
                        dialog.cancel();
                    }
                });

        final AlertDialog alert = dialog.create();
        alert.show();

    }

    private void openSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        Uri uri = Uri.fromParts("package", getPackageName(), null);
        intent.setData(uri);
        startActivityForResult(intent, 101);
    }

    private void chooseImageFromGallery() {
        Dexter.withActivity(this)
                .withPermissions(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                .withListener(new MultiplePermissionsListener() {
                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        if (report.areAllPermissionsGranted()) {
                            Intent pickPhoto = new Intent(Intent.ACTION_PICK,
                                    android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                            startActivityForResult(pickPhoto, REQUEST_GALLERY_IMAGE);
                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                }).check();

    }

    private Uri getCacheImagePath(String fileName) {
        File path = new File(getExternalCacheDir(), "camera");
        if (!path.exists()) path.mkdirs();
        File image = new File(path, fileName);
        sourceFile = new File(path, fileName);
        return getUriForFile(Sharepublicconversation.this, getPackageName() + ".provider", image);
    }

    private void takeCameraImage() {
        Dexter.withActivity(this)
                .withPermissions(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                .withListener(new MultiplePermissionsListener() {
                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        if (report.areAllPermissionsGranted()) {
                            fileName = System.currentTimeMillis() + ".jpg";
                            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, getCacheImagePath(fileName));
                            if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                                startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
                            }
                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                }).check();
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case REQUEST_IMAGE_CAPTURE:
                if (resultCode == RESULT_OK) {
                    Uri imageUri = getCacheImagePath(fileName);
                    //sourceFile = new File(imageUri.getPath());
                    status = true;
                    //Toast.makeText(Sharepublicconversation.this,fileName,Toast.LENGTH_LONG).show();
                    extension = "jpg";
                    try {
                        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
                        image_post.setImageBitmap(bitmap);
                        icon_cancel_image_view.setVisibility(View.VISIBLE);
                        image_view.setVisibility(View.VISIBLE);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } else {
                    Toast.makeText(Sharepublicconversation.this,"Echec !!",Toast.LENGTH_LONG).show();
                    //setResultCancelled();
                }
                break;
            case REQUEST_GALLERY_IMAGE:
                if (resultCode == RESULT_OK) {
                    Uri imageUri = data.getData();
                    extension = "jpg";
                    sourceFile = new File(getPathGallery(imageUri));
                    status = true;
                    Toast.makeText(Sharepublicconversation.this,getPathGallery(imageUri),Toast.LENGTH_LONG).show();
                    try {
                        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), imageUri);
                        //bitmapboss = bitmap;
                        image_post.setImageBitmap(bitmap);
                        icon_cancel_image_view.setVisibility(View.VISIBLE);
                        image_view.setVisibility(View.VISIBLE);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    //Toast.makeText(Sharepublicconversation.this,"Echec !!",Toast.LENGTH_LONG).show();
                } else {
                    //setResultCancelled();

                    Toast.makeText(Sharepublicconversation.this,"Echec !!",Toast.LENGTH_LONG).show();
                }
                break;
            default:
                break;
        }
    }



    /**
     * Uploading the file to server
     * */
    private class UploadFileToServer extends AsyncTask<Void, Integer, String> {
        @Override
        protected void onPreExecute() {
            // setting progress bar to zero
            //progressBar.setProgress(0);
            super.onPreExecute();
        }

        @Override
        protected void onProgressUpdate(Integer... progress) {
            // Making progress bar visible
            //progressBar.setVisibility(View.VISIBLE);

            // updating progress bar value
            //progressBar.setProgress(progress[0]);

            // updating percentage value
            //pDialog.dismiss();
        }

        @Override
        protected String doInBackground(Void... params) {
            return uploadFile();
        }

        @SuppressWarnings("deprecation")
        private String uploadFile() {
            String responseString = null;

            HttpClient httpclient = new DefaultHttpClient();
            HttpPost httppost = new HttpPost(Const.dns.concat("/uploads/uploadScript.php"));

            try {
                AndroidMultiPartEntity entity = new AndroidMultiPartEntity(
                        new AndroidMultiPartEntity.ProgressListener() {

                            @Override
                            public void transferred(long num) {
                            }
                        });

                // Adding file data to http body
                entity.addPart("photostatus", new FileBody(sourceFile));

                // Extra parameters if you want to pass to server
                entity.addPart("name_file", new StringBody(name_file));
                httppost.setEntity(entity);

                // Making server call
                HttpResponse response = httpclient.execute(httppost);
                HttpEntity r_entity = response.getEntity();

                int statusCode = response.getStatusLine().getStatusCode();
                if (statusCode == 200) {
                    // Server response
                    responseString = EntityUtils.toString(r_entity);
                } else {
                    responseString = "Error occurred! Http Status Code: "
                            + statusCode;
                }

            } catch (ClientProtocolException e) {
                responseString = e.toString();
            } catch (IOException e) {
                responseString = e.toString();
            }

            return responseString;

        }

        @Override
        protected void onPostExecute(String result) {
            //Toast.makeText(ImagePickerActivity.this, "Votre Photo de profil s'est mise a jour avec succes !", Toast.LENGTH_SHORT).show();
            /*String url = Const.dns.concat("/WazzabyApi/public/api/updatelibelleuserphoto?id_user=").concat(String.valueOf(user.getID())).concat("&libelle_photo=").concat("photo_".concat(String.valueOf(user.getID())).concat(".jpg"));
            Connexion(url);*/
            super.onPostExecute(result);
            etat = "0";
            RequeteFinale();
        }

    }


    public void showJSON(String response)
    {
        try {
            reponse = new JSONObject(response);
            name_file = reponse.getString("name_file");
            id_messagepublic = reponse.getString("id_messagepublic");
            ID_photo = reponse.getString("ID_photo");
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }


    private void RequeteFinale()
    {
        String urlrequetefinale;
        if(status) {
            urlrequetefinale = Const.dns.concat("/WazzabyApi/public/api/SaveMessagePublic?etat=").concat(this.etat).concat("&libelle=").concat(LIBELLE).concat("&id_problematique=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB())).concat("&ID=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getID())).concat("&id_message_public=").concat(this.id_messagepublic);
        }else {
            urlrequetefinale = Const.dns.concat("/WazzabyApi/public/api/SaveMessagePublic?etat=").concat(this.etat).concat("&libelle=").concat(LIBELLE).concat("&id_problematique=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB())).concat("&ID=").concat(String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getID()));
        }
        StringRequest stringRequest = new StringRequest(Request.Method.GET, urlrequetefinale,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        pDialog.dismiss();
                        Toast.makeText(Sharepublicconversation.this,res.getString(R.string.comment_share),Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(Sharepublicconversation.this,Home.class);
                        startActivity(intent);
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        pDialog.dismiss();

                        if(error instanceof ServerError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_servererror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof NetworkError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof AuthFailureError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof ParseError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof NoConnectionError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else if(error instanceof TimeoutError)
                        {
                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }else
                        {

                            Toast.makeText(Sharepublicconversation.this,res.getString(R.string.error_volley_noconnectionerror),Toast.LENGTH_LONG).show();

                        }
                    }
                }){
            @Override
            protected Map<String,String> getParams(){
                Map<String,String> params = new HashMap<String, String>();
                //params.put("ID_EME",);
                //params.put("IDProb",String.valueOf(database.getUSER(Integer.valueOf(session.getUserDetail().get(SessionManager.Key_ID))).getIDPROB()));
                //params.put("LIBELLE",LIBELLE);
                return params;
            }

        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }


    public String getPathGallery(Uri uri)
    {
        Cursor cursor = getContentResolver().query(uri,null,null,null,null);
        cursor.moveToFirst();
        String document_id = cursor.getString(0);
        cursor.close();

        cursor = getContentResolver().query(
                 android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                null,MediaStore.Images.Media._ID+" = ?",new String[]{document_id},null);
        cursor.moveToFirst();
        String path = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
        cursor.close();
        return path;
    }


}
