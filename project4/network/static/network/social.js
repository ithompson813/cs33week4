  document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  //document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
 // document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
   // document.querySelector('#all').addEventListener('click', () => load_posts('all'));
    document.querySelector('#new').addEventListener('click', () => post_post());
    document.querySelector('#following').addEventListener('click', () => load_posts('following'))
   // alert('1');

  })
  

  function load_posts(posts){

    document.querySelector('#all_posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';


    document.querySelector('#following-view').innerHTML = "Following";

    //todo, get from url path
    fetch(`/posts/${id}`)
    .then(response => response.json())
    .then(emails => {

        alert('something');

    });
  }



  function new_post(){

    document.querySelector('#all_posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';



  }


  //all posts should just be the default homepage
  //following should hide all posts and show following
  //all posts will always refresh because it is a view

  //make new a view

  //make profile a view

  //have the eq of path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
    // either return all, or followed by filtered by user
