package com.wazaby.android.wazaby.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.support.v7.widget.PopupMenu;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.wazaby.android.wazaby.R;
import com.wazaby.android.wazaby.appviews.AfficheCommentairePublic;
import com.wazaby.android.wazaby.model.Const;
import com.wazaby.android.wazaby.model.data.ConversationItem;
import com.wazaby.android.wazaby.model.data.ConversationPublicItem;

import java.util.Collections;
import java.util.List;

import static android.support.v4.content.ContextCompat.startActivity;

import hani.momanii.supernova_emoji_library.Actions.EmojIconActions;
import hani.momanii.supernova_emoji_library.Helper.EmojiconEditText;
import hani.momanii.supernova_emoji_library.Helper.EmojiconTextView;

/**
 * Created by bossmaleo on 09/11/17.
 */

public class ConversationspublicAdapter extends RecyclerView.Adapter<ConversationspublicAdapter.MyViewHolder>  implements MenuItem.OnMenuItemClickListener{


    List<ConversationPublicItem> data = Collections.emptyList();
    private LayoutInflater inflater;
    private Context context;


    public ConversationspublicAdapter(Context context,List<ConversationPublicItem> data)
    {
        this.context = context;
        inflater = LayoutInflater.from(context);
        this.context = context;
        this.data = data;
    }

    public void delete(int position)
    {
        data.remove(position);
        notifyItemRemoved(position);
    }

    @Override
    public ConversationspublicAdapter.MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

        View view = inflater.inflate(R.layout.adapterconversationspublic,parent,false);
        ConversationspublicAdapter.MyViewHolder holder = new ConversationspublicAdapter.MyViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(final ConversationspublicAdapter.MyViewHolder holder, int position) {
        final ConversationPublicItem current = data.get(position);
        holder.title.setText(current.getNameMembreProb());
        holder.title1.setText(current.getDatetime());
        holder.contenu.setText(current.getContenu());
        holder.commentnumber.setText(current.getCommentnumber());
        if(!current.getImageID().equals("null")) {
            Glide.with(current.getContext1())
                    .load(Const.dns+"/uploads/photo_de_profil/" + current.getImageID())
                    .into(holder.picture);
        }else
        {
            holder.picture.setImageResource(R.drawable.ic_profile_colorier);
        }
        holder.commenticon.setImageResource(current.getIconComment());
        holder.commentblock.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context, AfficheCommentairePublic.class);
                intent.putExtra("nom",current.getID());
                context.startActivity(intent);
                //context.startActivities(intent);
                //startActivity(intent);
                //Toast.makeText(context,"Voici l'ID de ce comment : "+current.getID(),Toast.LENGTH_LONG).show();
            }
        });

        holder.menuderoulant.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                PopupMenu dropDownMenu = new PopupMenu(context, holder.menuderoulant);
                dropDownMenu.getMenuInflater().inflate(R.menu.drop_down_menu, dropDownMenu.getMenu());
                dropDownMenu.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {

                    @Override
                    public boolean onMenuItemClick(MenuItem menuItem) {
                        Toast.makeText(context, "You have clicked " + menuItem.getTitle(), Toast.LENGTH_LONG).show();
                        return true;
                    }
                });
                dropDownMenu.show();
            }
        });
        //on test l'affichage ou non affichage des images des postes
        if (current.getEtat_photo_status().equals("block")) {
            holder.photo_du_poste.setVisibility(View.VISIBLE);
            //le code xxl pour setter l'image dans le background de mon relativelayout
            Glide.with(context).load(current.getStatus_photo()).asBitmap().into(new SimpleTarget<Bitmap>(200, 200) {
                @Override
                public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                    Drawable drawable = new BitmapDrawable(context.getResources(), resource);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                        holder.photo_du_poste.setMinimumWidth(1024);
                        holder.photo_du_poste.setMinimumHeight(768);
                        holder.photo_du_poste.setBackground(drawable);
                    }
                }
            });
        }else if(current.getEtat_photo_status().equals("none")) {
            holder.photo_du_poste.setVisibility(View.GONE);
        }
        //holder.icononline.setColorFilter(context.getResources().getColor(current.getColor1()));
    }


    @Override
    public int getItemCount() {
        return data.size();
    }

    @Override
    public boolean onMenuItemClick(MenuItem item) {
        return false;
    }

    class MyViewHolder extends RecyclerView.ViewHolder
    {
        TextView title;
        TextView title1;
        EmojiconTextView contenu;
        TextView commentnumber;
        ImageView picture;
        ImageView commenticon;
        LinearLayout commentblock;
        ImageView menuderoulant;
        RelativeLayout photo_du_poste;
        ImageView monbackground;

        public MyViewHolder(View itemView)
        {
            super(itemView);
            title = (TextView)itemView.findViewById(R.id.title);
            title1 = (TextView)itemView.findViewById(R.id.title1);
            contenu =  itemView.findViewById(R.id.contenu);
            commentnumber = (TextView) itemView.findViewById(R.id.contenucomment);
            picture = (ImageView) itemView.findViewById(R.id.icon);
            commenticon = (ImageView) itemView.findViewById(R.id.commenticon);
            commentblock = (LinearLayout) itemView.findViewById(R.id.commentblock);
            menuderoulant = (ImageView) itemView.findViewById(R.id.menu_deroulant);
            photo_du_poste = (RelativeLayout) itemView.findViewById(R.id.photo_du_poste);
        }
    }


}
