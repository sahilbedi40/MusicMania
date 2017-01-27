import { Component } from '@angular/core';
import { File,MediaPlugin } from 'ionic-native';
import { Platform } from 'ionic-angular';

//declare var cordova:any;
@Component({
  selector: 'player',
  templateUrl: 'player.html'
})
export class PlayerPage {
items:Array<{title:string,path:string}>=[];
isPlaying:boolean=false;
songStatus:number;
selectedTitle:string;
SelectedPath:string;
isHidden=true;
myPlayer = null;
  constructor(public platform: Platform) {
     this.initializeApp();     
    //  this.initializeMedia();
  }

 initializeMedia(){
   File.listDir("file:///storage/emulated/","0").then((files) =>{
         for(let i=0;i< files.length;i++){
           if(files[i].isDirectory){
            this.items.push({title: files[i].name.toString(),path:files[i].fullPath});
           }                      
         }
    }).catch(
      (error) =>{
       alert("error:"+error);
      }
    )
 }

initializeApp() {
    File.listDir("file:///storage/emulated/0/","Download").then((files) =>{
         for(let i=0;i< files.length;i++){
           if(files[i].isDirectory){
                  var reader=files[i].filesystem.root.createReader();
                  reader.readEntries((entries) =>{
                    for(let j=0;j<entries.length;j++){
                      if(entries[j].isFile){
                         if(entries[j].name.indexOf(".mp3") >= 0){
                           this.items.push({title: entries[j].name.toString(),path:entries[j].fullPath});
                        }
                      }                      
                    }                    
                  })
           }
           else{
                   if(files[i].name.indexOf(".mp3") >= 0){
                     files[i].getMetadata((metadata) =>{
                       //metadata
                     },
                     (error)=>{

                     })
                       this.items.push({title:files[i].name.toString(),path:files[i].fullPath});
                   }
                   
           }
           
         }
    }).catch(
      (error) =>{
       alert("error:"+error);
      }
    )
  }

  PlaySong(item:string)
  {
    this.isHidden=false;
    if(this.isPlaying && (this.songStatus != MediaPlugin.MEDIA_PAUSED))
    {
         this.StopSong();         
         this.isPlaying=false;
    }

     if((this.songStatus!=MediaPlugin.MEDIA_PAUSED)) {
        this.myPlayer= new MediaPlugin(item, this.onStatusUpdate);
        this.MediaInitialize();
     }   
    
    this.myPlayer.play();
    this.isPlaying=true;
    this.songStatus =MediaPlugin.MEDIA_NONE;
  }

  onStatusUpdate(status){        
    console.log(status);
  }

  StopSong(){
    this.myPlayer.stop();
    this.myPlayer.release();
    this.isPlaying=false;
    this.songStatus=MediaPlugin.MEDIA_NONE;
  }
  
  PauseSong(){
    this.songStatus=MediaPlugin.MEDIA_PAUSED;
    this.myPlayer.pause();
  }

  MediaInitialize(){
    this.myPlayer.init.then(() =>{
      console.log('Playback Finished');
    },
    (err) =>{
      alert('somthing went wrong! error code: ' + err.code + ' message: ' + err.message);
    }

    )
  }

  PlaySelectedSong(item:any)
  {
    this.songStatus=MediaPlugin.MEDIA_NONE;
    this.isHidden=false;
    this.selectedTitle=item.title;
    this.SelectedPath=item.path;
    this.PlaySong(item.path);
  }

}







//  (<any>window).resolveLocalFileSystemURL(file,(fsSystem) =>{
//             var reader=fsSystem.createReader();
//           })