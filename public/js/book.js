// const { events } = require("../../models/userModel");

const link =window.location.href;
const params = link.split('/');
let mine = false;
let book_title;
let book_desc;
let book_cate;
let book_langs;
let book_authors;

const action=params[4];
const book = params[5];

//check cookies
let width = screen.width;


//page elements
const cover = $('#bookCover');
const title = $('#bookTitle');
const description = $('#description');
const ifUser = $('#ifUser');
const comment = $('#comment');



//reactions
const likes = $('#like_count');
const dislikes = $('#dislike_count');

//stats
const seens = $('#seen');
const played =$('#played')


const loadBook = async ()=>{
    try{
        const details = await getBookdetails(book);
        if(!details){
            location.href="/";
        }
        
        
        book_title=details.bookBack.title;
        book_desc=details.bookBack.description;
        book_cate= details.bookBack.category;
        book_langs=details.bookBack.languages;
        book_authors=details.bookBack.authors;


    //fill the blanks
    cover.attr('src',details.bookBack.cover);
    title.text(details.bookBack.title);
    description.text(details.bookBack.description);

    if(details.creator){
        ifUser.append(
           
            $('<button/>',{'class':'button btn cat signin','id':'chapter'}).append('Add Chapter'),
            $('<button/>',{'class':'button btn cat signin','id':'update'}).append('Edit')

            
            
        );
        owner_book()
        mine = true;
        
    }

    details.bookBack.category.forEach(cat => {//print categories
        addCategory(cat,'category');
    });
    details.bookBack.languages.forEach(lang => {
        addLangs(lang,'langs');
    })

    details.bookBack.authors.forEach(author=>{//print authors
        addAuthor(author,'Authors');
    });

   
    }
    catch(err){
        toast({message:err,title:'Could not get books',bg:'bg-danger'});
    }



}

const Liking = async ()=>{
    try{
    const reacted = await postReaction(book,'Like');
        if(reacted){
        
        }

    }
    catch(error){
        toast({message:err,title:'Could not register reaction',bg:'bg-warning'});
    }
    
}

const Disliking = async ()=>{
    try{
        const reacted = await postReaction(book,'Dislike');
            if(reacted){
            
            }
    }
    catch(error){
        toast({message:err,title:'Could not register reaction',bg:'bg-warning'});
    }
    

}

const reactions = async ()=>{//get all reactions...............................
    try{
        const reacts = await getReaction(book);
            // if(!reacts){
               
                
            // }
            likes.text(reacts.likes);
                dislikes.text(reacts.dislikes);
    }
    catch(error){
        throw error;

    }
   
}

//Seen
const post_seen = async ()=>{//post seen
    try{
        const see = await postSeen(book);
            if(see){
                console.log(see);
            }
    }
    catch(err){
        toast({message:err,title:'Could not post seen',bg:'bg-warning'});
    }
   
}

const get_seen = async ()=>{//get seen
    try{
        const saw = await getSeen(book);
            if(saw){
                
                seens.text(saw.seen);
                played.text(saw.played);
            }
    }
    catch(err){
        toast({message:err,title:'could not get seen',bg:'bg-warning'});
    }
    
}



const get_comments = async ()=>{//get all comments
    try {
        const coms = await getComments(book);
        if(coms){
            $('#comments').text('');
            coms.comments.forEach(comet=>{
                let msg ={
                    dp:comet.commenter[0].dp,
                    user:comet.commenter[0]._id,
                    username:comet.commenter[0].username,
                    time:comet.moment,
                    comment:comet.comment
                }

                addCommentOut('comments',msg);

                // console.log(msg);
            })

        }
        else{

            throw 'Trouble getting comments'
        }
    } 
    catch (error) {
        toast({message:error,title:'Something unexpected happened',bg:'bg-warning'});
    }

}

const post_comment = async()=>{
    try {
        let msg = comment.val();
        // console.log(msg);
        if(!msg){
            throw 'Type something first'
        }
        let comment_gone = await postComment(book,msg);
        if(!comment_gone){
            throw 'Comment did not go through!';
            // return false
        }
        else{
            comment.val('');
            return true;
        }

        
    } catch (error) {
        let msg = error;
        if(msg=="Not logged in"){
            msg +=` <a href="/user/" class="btn btn-info">Login</a>`;
        }
        
        toast({message:msg,title:'Comment Problem',bg:'bg-warning'});
    }
}



const loadChapters = async () =>{//load chapters if any..............................................
    try{
       let back;
        const details = await getChapters(book);
        //  console.log('in load',details);
        if(details.chapters.length==0){
            $('#Chapters').html('');
            $('#Chapters').append(`
            <center>
            <a href="/" class="button cat btn-lg btn-block">Checkout other books</a>
            </center>
            `)
            back= false
        }
        else{
            $('#Chapters').html('');
            details.chapters.forEach(chap=>{
                // console.log(chap);
                addChapter(chap,'Chapters',mine);
            })
            if(details.info!=='Active subscription'){
                console.log(details.info);
                $('#Chapters').append(`
            <center>
            <a href="/subscribe" class="button cat btn-lg btn-block">Get yourself a plan to enjoy more</a>
            </center>
            `)

            }
            if(mine){
                // alert('This is mine');
                owner_events();
            }
            back = true
        }
        return true;
    }
    catch(error){
        let msg = error;
        toast({message:msg,title:'Chapter issues',bg:'bg-danger'});
    }
}



const playChapter = async (chapt)=>{
   try{
        let state = await newSong(chapt);
        
   }
   catch(error){
    let msg = error;
    toast({message:msg,title:'Error Playing',bg:'bg-danger'});

   }
}
//On Page conditions





//On page conditions


/*main function        __     _____
        \\\_|\\   /\  | |   /  __  \
        \\\_|\\  /_\  | |  |  |  | \  
        \\   \\ /  \  |_|  |_/   | |

*/
        $(document).ready(async ()=>{

         try{        

            
        const green = await loadBook();
        post_seen();
        reactions();
        get_seen();
        get_comments();
        setInterval(() => {
            reactions();
            get_seen();
            get_comments();
        }, 10000);
        
        Event(); //register events 

       toastHolder(); // toast holder
       $('.toast').toast('show');



        const go =await loadChapters(); 
        if(go){
            preventAudioDownload(); 
            
            const buttons = document.querySelectorAll('.chap_btn')

            buttons.forEach(ele=>{
                // console.log(ele);
                ele.addEventListener('click',()=>{
                    let chapID = ele.getAttribute("data-target")
                    playChapter(chapID);
                    
                });
            })
            
        // player stuff

            // player stuff
        }
        const chapter = $('#chapter');
        
        
        

            if(green){
                prevenImagetDownload();
                
            }


            const mod = await initModal();//start modal
                if(mod){
                    const myModal= $('#myModal');

                }

            //actions
            
                

               

            }
            catch(err){

            }
    


        });


        const Event = ()=>{

            $('#chapter').on('click',()=>{//new chapter
                $('.modal-body').html('');
                postChapter(book,'.modal-body');

                // call modal
                $('#myModal').modal('toggle');
            })

            $('#comment_go').on('click touchstart',async ()=>{//add comment
                let state = await post_comment();
                if(!state){
                    $(this).css('background-color','brown');
                }
                else{
                    $(this).css('background-color','green')
                }
    
            });

            document.getElementById('comment').addEventListener("keypress", async (event) => {
                if (event.key=="Enter"||event.code== 13 ||event.code=="Enter") {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    if(width<=760){
                        let state = await post_comment();
                    if(!state){
                        $(this).css('background-color','brown');
                    }
                    else{
                        $(this).css('background-color','green')
                    }
                    }

                    document.getElementById("comment_go").click();//not mobile

                    
                }
            });

           $('#comment').on('click',()=>{
               
                // alert(width);
                if(width<=760){
                    $("#comment_go").html("Hit <span class='btn btn-outline-light'>Enter</span> to Send Comment").css('background','#3b3838').attr('disabled','true');
                }
                else{
                    $("#comment_go").html(`<i class="fas fa-paper-plane"></i>`).css('background','#17a2b8').removeAttr('disabled');
                }
            });


            if(mine){
                


                
            }

            // document.addEventListener('keypress', (event) => {
            //     var name = event.key;
            //     var code = event.code;
            //     // Alert the key name and key code on keydown
            //     alert(`Key pressed ${name} \r\n Key code value: ${code}`);
                
            //   }, false);

        }

        const owner_events =()=>{//events on chapter by Owner
            console.log('mine');

                const chapEdits = document.querySelectorAll('#edit-chapter');
                chapEdits.forEach(ele => {
                    ele.addEventListener('click',()=>{
                        let chapID = ele.getAttribute("data-target")
                        let Divholder =ele.parentElement.parentElement.parentElement;

                        let title =Divholder.children[0].children[0].innerHTML.slice(1);
                        let desc =Divholder.parentElement.children[0].children[2].innerHTML;
                        // alert(chapID);

                        $('.modal-body').html('');
                        updateChapter(book,chapID,'.modal-body');

                        $('#edit_chap_title').val(title);
                        $('#edit_chap_description').val(desc);


        
                        // call modal
                        $('#myModal').modal('toggle');
                        
                    });
                });
        }


 const owner_book =async ()=>{//events on book by owner


            const update = $('#update');

        update.on('click',async ()=>{//update
            $('.modal-body').html('');
            UpdatebookForm(book,'.modal-body');

            console.log(book_title,book_desc);
            //autofill
            $('#edit_title').val(book_title);
            $('#edit_description').val(book_desc);





            //multiselect category
           
            $('#edit_bookcategory').select2({
                theme: 'classic',
                placeholder: 'Select category',
                maximumSelectionLength: 4
            });

            //multiselect languages
            $('#edit_bookLangs').select2({
                theme: 'classic',
                placeholder: 'Select languages',
                maximumSelectionLength: 4
            });

            let cat = await getCategory();
            cat.forEach(cate => {
                let set = false;
                if(book_cate){
                    set = book_cate.includes(cate.title[0]);
                }
                
                // console.log(set,cate.title[0]);
                var newOption = new Option(cate.title[0], cate.title[0], set, set);
             $('#edit_bookcategory').append(newOption).trigger('change');
             });
             
             let lang = await getLanguages();
             lang.forEach(cate => {
                let set = false;
                 if(book_langs){
                   set= book_langs.includes(cate.title[0]);
                 }
                
                // console.log(set,cate.title[0]);
                var newOption = new Option(cate.title[0], cate.title[0], set, set);
             $('#edit_bookLangs').append(newOption).trigger('change');
             });



            $('#myModal').modal('toggle');
        })


        }




