

class Message{
    
    static txt;
    
    static alert_box(txt = null){

        this.txt = txt;
          
        const tag_temp_alert_box = document.querySelector("#temp_alert_box");
        const tag_temp_alert_box_copy = document.importNode(tag_temp_alert_box.content,true);
      
        const tag_txt_alert_box = tag_temp_alert_box_copy.querySelector(".txt_alert_box");
              
        tag_txt_alert_box.innerHTML = this.txt;

        const tag_bt_alert_box = tag_temp_alert_box_copy.querySelector(".bt_alert_box");
     
       
        document.body.appendChild(tag_temp_alert_box_copy);

        tag_bt_alert_box.focus();
      
        var p = new Promise((resolve,rejected)=>{

            tag_bt_alert_box.addEventListener("click",function(){

                document.querySelector(".alert_box").parentElement.remove();
                
                resolve(1); 
                rejected(0); 

            });

        });

       return p;
    
    }


   static confirm_box(txt = null){

            this.txt = txt;
           
            const tag_temp_confirm_box = document.querySelector("#temp_confirm_box");
            const tag_temp_confirm_box_copy = document.importNode(tag_temp_confirm_box.content,true);
                        
            const tag_txt_confirm_box = tag_temp_confirm_box_copy.querySelector(".txt_confirm_box");
            tag_txt_confirm_box.innerHTML = this.txt;

            const tags_bts_confirm_box = tag_temp_confirm_box_copy.querySelectorAll(".bt_confirm_box");

            document.body.appendChild(tag_temp_confirm_box_copy);

            tags_bts_confirm_box[0].focus();


            const Change_active_button = (ev) => {  

                var key_code = ev.keyCode;
                var valid_key_codes = [37,38,39,40];

            
                if(valid_key_codes.find(k_c => (k_c == key_code)))
                {
                  
                    

                    if(document.activeElement == tags_bts_confirm_box[0])
                        tags_bts_confirm_box[1].focus();
                    else if(document.activeElement == tags_bts_confirm_box[1])
                        tags_bts_confirm_box[0].focus();
                        
                }          

            }

        window.addEventListener("keydown",Change_active_button);


        var p = new Promise((resolve,rejected)=>{
            
            tags_bts_confirm_box[0].addEventListener("click", function(ev){

                document.querySelector(".confirm_box").parentElement.remove();
                window.removeEventListener("keydown",Change_active_button);
                
                resolve(ev.target.classList.contains("yes")); 
                rejected(ev.target.classList.contains("yes")); 
                
            });
            
            tags_bts_confirm_box[1].addEventListener("click", function(ev){ 
                               
                document.querySelector(".confirm_box").parentElement.remove();
                window.removeEventListener("keydown",Change_active_button);
                
                resolve(ev.target.classList.contains("yes")); 
                rejected(ev.target.classList.contains("yes")); 
                                
            });

        });

        return p;

    }

}