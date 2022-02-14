// Constants created from HTML TAGS;

const tag_main_menu = document.querySelector("#main_menu");
const tag_data_manager_menu = document.querySelector("#data_manager_menu");
const tag_credits_screen = document.querySelector("#credits_screen");
const tag_game_screen = document.querySelector("#game_screen");

const tag_bt_open_data_manager_menu = document.querySelector("#bt_open_data_manager_menu");
const tag_bt_open_credits_screen = document.querySelector("#bt_open_credits_screen");
const tag_bt_close_data_manager_menu = document.querySelector("#bt_close_data_manager_menu");
const tag_bt_close_credits_screen = document.querySelector("#bt_close_credits_screen");
const tag_bt_start_game = document.querySelector("#bt_start_game");
const tag_bt_open_input_data_menu = document.querySelector("#bt_open_input_data_menu");
const tag_bt_start_new_game = document.querySelector("#bt_start_new_game");
const tag_bt_send_character = document.querySelector("#bt_send_character ");
const tag_bt_exit_game = document.querySelector("#bt_exit_game");

const tag_data_table = document.querySelector("#data_table");
const tag_tbody = tag_data_table.querySelector("tbody");

const tag_game_container = document.querySelector("#game_container"); 
const tag_answer_container = document.querySelector("#answer_container");
const tag_txt_tip = document.querySelector("#txt_tip");
const tag_character  = document.querySelector("#character ");
const tag_txt_errors = document.querySelector("#txt_errors");
const tag_txt_sent_characters = document.querySelector("#txt_sent_characters");

const tag_template_box_guess_word = document.querySelector("#template_box_guess_word");
const tag_template_input_data_menu = document.querySelector("#template_input_data_menu");
const tag_template_data_table_row = document.querySelector("#template_data_table_row");

// ============================================================================

// Auxiliary Variables;

var local_storage_data = new Local_storage_data(1,"hangman_data");
var data = [];
var active_data = [];
var current_answer = [];
var hidden_answer = [];
var sent_characters = [];
var sorted_index;
var count_errors = 0;
var max_errors = 5; 
var error = true;
var game_status = false;
var win = false;

// ============================================================================

// Events

window.addEventListener("load",Start);

tag_bt_open_data_manager_menu.addEventListener("click",Engine_open_data_manager_menu);
tag_bt_open_credits_screen.addEventListener("click",Engine_open_credits_screen);
tag_bt_open_input_data_menu.addEventListener("click",Engine_add_new_data);
tag_bt_close_data_manager_menu.addEventListener("click",Engine_close_data_menager_menu);
tag_bt_close_credits_screen.addEventListener("click",Engine_close_credits_screen);
tag_bt_start_game.addEventListener("click",Engine_start_game);
tag_character.addEventListener("input",Check_character_field);
tag_bt_send_character.addEventListener("click",Engine_check_sent_character);
tag_bt_start_new_game.addEventListener("click",Engine_start_new_game); 
tag_bt_exit_game.addEventListener("click",Engine_exit_game);  

// ============================================================================

// Functions;

function Start()
{
    data = local_storage_data.load();

    active_data = data.filter(Build_matriz_active_data);

    Check_active_data();    
}

// ============================================================================

function Update_tag_txt_errors()
{
    Set_element_txt(tag_txt_errors,count_errors + " / " + max_errors);   
}

// ============================================================================

function Update_tag_txt_sent_characters()
{
    Set_element_txt(tag_txt_sent_characters,sent_characters.join(", "));   
}

// ============================================================================

function Check_active_data()
{
    Set_element_disabled(tag_bt_start_game,(!(active_data.length)));
    Set_element_disabled(tag_bt_start_new_game,(!(active_data.length)));
}

// ============================================================================


function Check_word_tip_fields(tag_button,tag_word_field,tag_tip_field)
{
        

        Customize_element_validity(tag_word_field,(!(Compare_strings(Get_element_value(tag_word_field).trim(),""))),"Empty Field.");
        Customize_element_validity(tag_tip_field,(!(Compare_strings(Get_element_value(tag_tip_field).trim(),""))),"Empty Field.");

        Set_element_disabled(tag_button,(!(
                                              tag_word_field.checkValidity() && 
                                              tag_tip_field.checkValidity()  
                                             )
                                           )
                                );

}

// ============================================================================

function Check_character_field()
{
    Set_element_value(tag_character,Convert_to_uppercase(tag_character.value.trim()));
  
    Customize_element_validity(tag_character,(!(sent_characters.includes(tag_character.value))),"Already Sent!");

    Set_element_disabled(tag_bt_send_character,(!(tag_character.checkValidity())));

    if(!(Get_element_disabled(tag_bt_send_character)))
        tag_bt_send_character.focus();
}

// ============================================================================

function Engine_open_data_manager_menu()
{
    if(data.length)
    {
        data.forEach((dt) => 
        {
            Add_table_row(dt);
        });
    }
    else
        Add_notification_table_row();
 
    Control_current_screen(tag_data_manager_menu,tag_main_menu);
   
}

// =============================================================================

function Engine_open_credits_screen()
{
    Control_current_screen(tag_credits_screen,tag_main_menu);
}

// =============================================================================


function Engine_close_data_menager_menu()
{        
    active_data = data.filter(Build_matriz_active_data);
  
    Check_active_data(); 
    Control_current_screen(tag_main_menu,tag_data_manager_menu);
    
    Clear_table_rows();

}

// =============================================================================


function Engine_close_credits_screen()
{        

    Control_current_screen(tag_main_menu,tag_credits_screen);

}

// =============================================================================


function Control_current_screen(screen_in,screen_out)
{
    Add_class(screen_out,"ghost");
    Remove_class(screen_in,"ghost");
}

// ==============================================================================

function Add_notification_table_row()
{

const tag_row = Create_element("tr");
const tag_col = Create_element("td");

Add_class(tag_row,"no_data");

Set_element_attribute(tag_col,"colspan","5");

Set_element_txt(tag_col,"THERE IS NO DATA");

Add_child(tag_row,tag_col);
Add_child(tag_tbody,tag_row);

}

// =============================================================================


function Add_table_row(new_data)
{
   
    const tag_copy_template_data_table_row = document.importNode(tag_template_data_table_row.content,true);

    const tag_table_row = tag_copy_template_data_table_row.querySelector("tr");
    const tag_answer = tag_table_row.cells[0];;
    const tag_tip = tag_table_row.cells[1];
    const tag_status = tag_table_row.cells[2].querySelector("input");
    const tag_button_update = tag_table_row.cells[3].querySelector("span");
    const tag_button_delete = tag_table_row.cells[4].querySelector("span");
    
    Set_element_txt(tag_answer,new_data[0].map((w)=>{return w.join("");}).join(" "));
    Set_element_txt(tag_tip,new_data[1]);
  
    Set_element_checked(tag_status,new_data[2]);
    Set_element_disabled(tag_status,true);

    Set_element_dataset(tag_table_row,"uniqueId",new_data[3]);

   
   tag_button_update.addEventListener("click",function()
   {
        Engine_update_data(Get_element_dataset(tag_table_row,"uniqueId"));
   });
      
   
   tag_button_delete.addEventListener("click",async function () {
    
    if(await Message.confirm_box("Are you sure that you want to delete this data?"))
        Engine_remove_table_row(tag_table_row);
   
    });
  
    
    Add_child(tag_tbody,tag_copy_template_data_table_row);

}

// =============================================================================


function Engine_remove_table_row(tag_table_row)
{

    var id = Get_element_dataset(tag_table_row,"uniqueId");

    var index = Search_index_matriz_data(id);
    
    Remove_table_row(tag_table_row);
  
    data.splice(index,1);
    
    if(data.length)
        local_storage_data.save(data);
    else
        {
        local_storage_data.remove();
        Add_notification_table_row();
        }
   
}

// =============================================================================

function Clear_table_rows()
{
    while(tag_tbody.childElementCount)
        Remove_table_row(tag_tbody.lastElementChild);
}

// =============================================================================

function Remove_table_row(table_row)
{
    Remove_element(table_row);
}

// =============================================================================

function Build_matriz_active_data(w)
{
    return (w[2]);
}

// =============================================================================

async function Engine_add_new_data()
{

    var new_data = await Engine_data_menu();

    if(new_data)
    {
        var index = data.length;
          
        data.push([new_data[0],new_data[1],new_data[2],new_data[3]]);

        if(data.length == 1)
            Remove_element(tag_tbody.lastElementChild);
    
        Add_table_row(data[index]);

        local_storage_data.save(data);
        
        Message.alert_box("Done!");

    }


}

// =============================================================================

async function Engine_update_data(id)
{
    
   var index = Search_index_matriz_data(id);
          
   var new_data = await Engine_data_menu(index);
   
   if(new_data)
   {
            data[index][0] = new_data[0];
            data[index][1] = new_data[1];
            data[index][2] = new_data[2];

            const tag_table_row = tag_data_table.querySelector("tbody").querySelectorAll("tr")[index];
                                  
            Set_element_txt(tag_table_row.cells[0],data[index][0].map(w　=>　w.join("")).join(" "));
            Set_element_txt(tag_table_row.cells[1],data[index][1]);
            Set_element_checked(tag_table_row.cells[2].querySelector("input"),data[index][2]);
            
            local_storage_data.save(data);
            
            Message.alert_box("Done!");
    }

}

// ==============================================================================

function Engine_data_menu(index = -1)
{

    const tag_template_input_data_menu_copy = document.importNode(tag_template_input_data_menu.content,true);
    
    const tag_bt_close_input_data_menu = tag_template_input_data_menu_copy.querySelector(".bt_close_input_data_menu");
    const tag_title = tag_template_input_data_menu_copy.querySelector(".title");
    const tag_new_answer = tag_template_input_data_menu_copy.querySelector(".answer");
    const tag_new_tip = tag_template_input_data_menu_copy.querySelector(".tip");
    const tag_status = tag_template_input_data_menu_copy.querySelector(".status");
    const tag_bt_save = tag_template_input_data_menu_copy.querySelector(".bt_save");
 

    if(index != -1)
    {
        Set_element_txt(tag_title,"EDIT DATA");      
        Set_element_value(tag_new_answer,data[index][0].map(w => w.join("")).join(" "));
        Set_element_value(tag_new_tip,data[index][1]);
        Set_element_checked(tag_status,data[index][2]);
    }
    else
    {
    Set_element_txt(tag_title,"ADD NEW DATA");
    Set_element_checked(tag_status,true);
    }


    tag_new_answer.focus();

    Check_word_tip_fields(tag_bt_save,tag_new_answer,tag_new_tip);

    Add_child(document.body,tag_template_input_data_menu_copy);
    
    tag_new_answer.addEventListener("input",function(){Check_word_tip_fields(tag_bt_save,tag_new_answer,tag_new_tip);});
    tag_new_tip.addEventListener("input",function(){Check_word_tip_fields(tag_bt_save,tag_new_answer,tag_new_tip);});
    
    
    return new Promise((resolve,rejected)=>{

        tag_bt_save.addEventListener("click",function(){
         
            Remove_element(document.querySelector("#input_data_menu").parentElement);

            var answer = Get_element_value(tag_new_answer).split(" ")
                                                          .filter(w => (!(Compare_strings(w,""))))
                                                          .map(w => w.split(""));
                 
            var new_data = [
                                answer,
                                Get_element_value(tag_new_tip).trim(),
                                Get_element_checked(tag_status) 
                           ];


            if(index == -1)
            {

                var generated_ids = data.map((d) =>{ return d[3]; });
                var id;
                          
                do
                {
   
                    id = Generate_random_number(1,(data.length + 10000));
            
                }while(generated_ids.indexOf(id) != -1);                

                new_data.push(id);

            }               
           
            resolve(new_data); 
            rejected(null); 
    
    });


    tag_bt_close_input_data_menu.addEventListener("click",function(){
         
        Remove_element(document.querySelector("#input_data_menu").parentElement);
           
        resolve(null); 
        rejected(null); 

    });


    });

}


// =============================================================================

function Engine_start_game()
{
    Control_current_screen(tag_game_screen,tag_main_menu);
    Start_game();
}

// =============================================================================

async function Engine_start_new_game()
{
   
    if(!(game_status))
    {
        
        Remove_answer_container_children();
    
        Set_element_disabled(tag_character,false);
        
        Remove_class(tag_game_container,"ten_percent_opacity"); 
        
        Start_game();
    
    }
    else if(await Message.confirm_box("Are you sure that you want to start a new game?"))
    {
             
        Remove_answer_container_children();
        Start_game();

    }    

}

// =============================================================================

function Start_game()
{

    game_status = true;

    win = false;

    count_errors = 0;
    
    sent_characters = [];

    Set_element_value(tag_character,null);

    Update_tag_txt_errors();
    Update_tag_txt_sent_characters();

    Define_word();

    tag_character.focus();
    
    Check_character_field();
}

// =============================================================================

function Define_word()
{

sorted_index = Generate_random_number(0,(active_data.length - 1));

current_answer = active_data[sorted_index][0].map((w)=> { return  w.map((l) => { return Convert_to_uppercase(l); })});        

var tip = active_data[sorted_index][1];

Set_element_txt(tag_txt_tip,tip);

hidden_answer = current_answer.map((w)=> { return  w.map((l) => { return " "; })});  

Build_characters_tags(hidden_answer);

}

// =============================================================================

function Build_characters_tags(array_hidden_answer)
{

    for(var word of array_hidden_answer)
    {
        const tag_div = Create_element("div");
        Add_class(tag_div,"box_word");

        for(var l of word)
        {
            const tag_input = Create_element("input");

            Set_element_attribute(tag_input,"type","text");
            Set_element_attribute(tag_input,"maxlength",1);
            
            Set_element_disabled(tag_input,true);

            Add_class(tag_input,"character")
            Add_child(tag_div,tag_input);
     
        }

        Add_child(tag_answer_container,tag_div);
    }

}

// =============================================================================

function Remove_characters_tags(t)
{
   Remove_element(t);

}

//  =============================================================================

function Engine_check_sent_character()
{

    sent_characters.push(Get_element_value(tag_character));

    sent_characters.sort();

    Update_tag_txt_sent_characters();

    Check_sent_character(Get_element_value(tag_character));

    Set_element_value(tag_character,null);

    Check_character_field();

    (error) ? Action_error() : Action_hit();

}

// =============================================================================

function Check_sent_character(c)
{

        error = true;
        
        var i = 0;

        for(var word of current_answer)
        {
            var pos;
         
            while((pos = word.indexOf(c)) != -1)
            {
    
                error = false;
    
                word[pos] = " ";
     
                hidden_answer[i][pos] = c;
                           
            }

        current_answer[i] = word;

        i++;

        }
}

// =============================================================================

function Update_inputs_tag_answer_container()
{
    var i = 0;
    for(const tag_box_word of tag_answer_container.querySelectorAll(".box_word"))
    {       
        var x = 0;
        while(x < tag_box_word.querySelectorAll(".character").length)
        {
            
            if(!(Compare_strings(hidden_answer[i][x]," ")))
                Set_element_value(tag_box_word.querySelectorAll(".character")[x],hidden_answer[i][x]);
                x++;
        }
       
        i++;
    }

}

// =============================================================================

async function Action_error()
{

    count_errors++;

    Update_tag_txt_errors();

    await Message.alert_box("Wrong!");
  
    (count_errors == max_errors) ? Engine_end_game() : tag_character .focus();    
}

// =============================================================================

async function Action_hit()
{

    Update_inputs_tag_answer_container();

    await Message.alert_box("Correct!");
          
    Check_victory();
       
    (win) ?
        Engine_end_game()
   : await Message.confirm_box("Do you want to guess the answer?") ?
        Engine_guess_word()
   :
        tag_character.focus();
}

// ====================================================================================

async function Engine_guess_word()
{

    var sent_answer = await Guess_word(); 
    
    Check_victory(sent_answer);
        
    if(win)
    {
       
        sent_answer.forEach((word) =>
        {
            word.forEach((character) => { Check_sent_character(character); }); 
        });

      
        Update_inputs_tag_answer_container();
        await Message.alert_box("Correct answer!");
              
    }else
        await Message.alert_box("Wrong answer!");
       
    Engine_end_game();    
}
        
// ====================================================================================

function Guess_word()
{    
    const clone_tag_answer_container = Clone_element(tag_answer_container);
    const tags_box_words_clone_tag_answer_container = clone_tag_answer_container.querySelectorAll(".box_word");
    const tags_inputs_clone_tag_answer_container = clone_tag_answer_container.querySelectorAll("input");
    const tag_template_box_guess_word_copy = document.importNode(tag_template_box_guess_word.content,true);
    const tag_bt_send_word = tag_template_box_guess_word_copy.querySelector("#bt_send_word");

    Set_element_attribute(clone_tag_answer_container,"id","answer_container_2");


    const focus_input = () => {

        for(const tag_input of tags_inputs_clone_tag_answer_container)
        {
        
            if(Compare_strings(Get_element_value(tag_input),''))
            {
                tag_input.focus();
                break;
            }
        }

}

 
    Call_function_helper(tags_inputs_clone_tag_answer_container,Set_element_disabled);
    Create_event_helper(tags_inputs_clone_tag_answer_container,"input",Uppercase_inputs_values);
    Create_event_helper(tags_inputs_clone_tag_answer_container,"input",focus_input);


    Add_child(tag_template_box_guess_word_copy.querySelector("#box_answer_container_2"),clone_tag_answer_container);
    Add_child(document.body,tag_template_box_guess_word_copy);
    

    focus_input();
    
   
   
    return new Promise((resolve,rejected)=>{

            tag_bt_send_word.addEventListener("click",function(){
                  
                    Remove_element(document.querySelector("#box_answer_container_2").parentElement.parentElement);                                   

                    resolve(Build_array_answer(tags_box_words_clone_tag_answer_container)); 
                    rejected(null); 

        });
        

        const Build_array_answer = (tags_box_words) => {

            var array_answer = [];
        
            for(var i = 0; i < tags_box_words.length; i++)
            {

                var word = [];
                
                for(var x = 0; x < tags_box_words[i].querySelectorAll(".character").length; x++)
                {
                 word.push(Get_element_value(tags_box_words[i].querySelectorAll(".character")[x]));   
                }
                
                array_answer[i] = word;
            }
                            
            return array_answer;
        } 
   
    
    });        
    
}

// =============================================================================

function Check_victory(word = hidden_answer)
{
  win = (Compare_strings(word.map(w => w.join("")).join(" "),
                         active_data[sorted_index][0].map(w => Convert_to_uppercase(w.join(""))).join(" ")      
                        )
        );  
}

// =============================================================================

async function Engine_end_game()
{

    game_status = false;

    var msg; 

    if(win)
    {
        
         msg = "CONGRATULATIONS!! YOU WIN!";
   
         var i = Search_index_matriz_data(active_data[sorted_index][3]);      
         
         data[i][2] = false;

         local_storage_data.save(data);
                
         active_data.splice(sorted_index,1);
        
   
    }else    
        msg = "YOU LOSE!";
    
    
    await Message.alert_box(msg);

    Add_class(tag_game_container,"ten_percent_opacity");
  
    Set_element_disabled(tag_character,true);
   
    Check_active_data();

    if(!(active_data.length))
    {
        await Message.alert_box("All the answers have been discovered!");
        
        if(await Message.confirm_box("Do you want to go to the data manager menu?"))
        {    
            Engine_exit_game();
            Engine_open_data_manager_menu();
        }

    }

}

// =============================================================================

function Search_index_matriz_data(id)
{

  return data.findIndex((element) => {
         
            return ((element[3] == id));   

        });      

}

// =============================================================================

function Remove_answer_container_children()
{
    while(tag_answer_container.childElementCount)
        Remove_element(tag_answer_container.lastChild);

}

// ==============================================================================

async function Engine_exit_game()
{

    if(!(game_status))
    {
        
        Control_current_screen(tag_main_menu,tag_game_screen);
        Remove_class(tag_game_container,"ten_percent_opacity");
        Remove_answer_container_children();    
        Set_element_disabled(tag_character,false);
    }
    else if(await Message.confirm_box("Are you sure that you want to come back to main menu?"))
    {
        game_status = false; 
        Control_current_screen(tag_main_menu,tag_game_screen);
        Remove_answer_container_children();
    }
}

// =============================================================================


function Uppercase_inputs_values(ev)
{

    Set_element_value(ev.target,Convert_to_uppercase(ev.target.value));
    
}

// =============================================================================

// Default Functions;


function Set_element_value(element,val)
{

    element.value = val;
    
}
    
// ==============================================================================

function Get_element_value(element)
{

   return element.value;
    
}
    
// ==============================================================================

function Set_element_disabled(element,status = false)
{

    element.disabled = status;
        
}
        
// =============================================================================

function Get_element_disabled(element)
{
    return element.disabled;
}        
// =============================================================================

function Set_element_txt(element,txt)
{

    element.textContent = txt;

}

// =============================================================================


function Get_element_txt(element)
{

return element.textContent;

}


// =============================================================================


function Set_element_checked(element,checked)
{

    element.checked = checked;

}

// =============================================================================

function Get_element_checked(element)
{

    return element.checked;

}

// =============================================================================

function Set_element_inner_html(element,innerHtml)
{

    element.innerHTML = innerHtml;
    
}
    
// ============================================================================


function Add_class(element,cls)
{

    element.classList.add(cls);

}

// =======================================================================


function Remove_class(element,cls)
{

    element.classList.remove(cls);
    
}

// =========================================================================================

function Convert_to_uppercase(txt)
{

    return txt.toUpperCase();
}

// ========================================================================================

function Generate_random_number(val1,val2)
{
            
    var num = val1 + (Math.round(Math.random() * (val2 - val1)));
    
    return num;
    
}
    
// ========================================================================

function Call_function_helper(data,func)
{

    for(var i = 0; i < data.length; i++)
        func(data[i]);
    
}

// =============================================================================

function Create_event_helper(elements,event,func)
{

    for(const element of elements)
        element.addEventListener(event,func);

}

// =============================================================================

function Compare_strings(str1,str2)
{
    
    return (!(str1.localeCompare(str2)));

}

// ===============================================================================

function Create_element(element)
{

    return document.createElement(element);

}   

// ========================================================================================

function Verify_element_attribute(element,attr)
{
    return element.hasAttribute(attr);
}
    
// ===========================================================================================

function Set_element_attribute(element,attr,val)
{
    element.setAttribute(attr,val);
            
}
    
// ===========================================================================================

function Get_element_attribute(element,attr)
{
   return element.getAttribute(attr);
        
}
    
// ===========================================================================================

function Remove_element_attribute(element,attr)
{
    element.removeAttribute(attr);
}
    
// ============================================================================================

function Add_child(element,child)
{

    element.appendChild(child);

}

// ========================================================================================

function Customize_element_validity(element,exp,msg_error)
{

    element.setCustomValidity(exp ? "" : msg_error);

}

// ========================================================================================

function Set_element_dataset(element,dataset_name,value)
{

    element.dataset[dataset_name] = value;

}

// ========================================================================================

function Get_element_dataset(element,dataset_name)
{

    return element.dataset[dataset_name];

}

// ========================================================================================


function Remove_element(element)
{

    element.remove(); 
    
}

// ========================================================================================


function Clone_element(element,clone_children_too = true)
{
    return element.cloneNode(clone_children_too);
}

// ========================================================================================