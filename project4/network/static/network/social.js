  document.addEventListener('DOMContentLoaded', function() {

    //prefil the main page to show all posts by default
    load_posts('all');

    //add an event listener to the all tab to reload the all posts page
    document.querySelector('#all').addEventListener('click', () => load_posts('all'));

    //add an event listener to the following tab to show only followed posts
    document.querySelector('#following').addEventListener('click', () => load_posts('following'))

    //add an event listener to the current user's name on the top bar to navigate to their profile page
    document.querySelector('#profile').addEventListener('click', () => view_profile(
      document.querySelector('#profile').innerText
    ))
    
  })
  

  function load_posts(posts){

   // document.querySelector('#all_posts-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'block';
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';

    if (posts === 'following')
    {
      document.querySelector('#posts-view').innerHTML = "Followed Posts";
    } 
    else if (posts === 'all') 
    {
      document.querySelector('#posts-view').innerHTML = "All Posts"
    }

    document.querySelector('#posts-view').style.fontSize = 'large';

    get_posts(posts)
  }



  function new_post(){

    document.querySelector('#all_posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'none';



  }


  function view_profile(user){

    // show profile view in place of new post view
    document.querySelector('#posts-view').style.display = 'block';
    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';

    //clear profile details and posts ahead of new data being written to them
    document.querySelector('#profile_details').innerHTML = '';
    document.querySelector('#posts-view').innerHTML = '';

    fetch(`/user/${user}`)
    .then(response => response.json())
    .then(user => {
      console.log(user)

      profile_details = document.createElement('div');
      prof_name = document.createElement('h1');
      num_followers = document.createElement('p');
      num_following = document.createElement('p');

      prof_name.innerHTML = (user.name + "'s Profile:");
      num_following.innerHTML=(`Following: ${user.followers.length}`);
      num_followers.innerHTML=(`Followers: ${user.following.length}`);

      profile_details.appendChild(prof_name);
      profile_details.appendChild(num_following);
      profile_details.appendChild(num_followers);
      document.querySelector('#profile_details').appendChild(profile_details);


    });



    prof_posts(user);
    
  }


  function get_posts(posts){

    fetch(`/posts/${posts}`)
    .then(response => response.json())
    .then(posts => {

        for (let i = 0; i < posts.length; i++)
        {

            let parent_div = document.createElement('div');
            let creator = document.createElement('h6');
            let content = document.createElement('h5');
            let time = document.createElement('p');
            let likes = document.createElement('p')

            //creator.innerHTML = (`${posts[i]['creator']} said: `);
            creator.innerHTML = posts[i]['creator']
            content.innerHTML = posts[i]['content'];
            time.innerHTML = posts[i]['timestamp'];
            likes.innerHTML = ('Likes: ' + posts[i]['likes'].length);

            creator.addEventListener("click", function() {
              view_profile(posts[i]['creator'])
            });

            parent_div.appendChild(creator);
            parent_div.appendChild(content);
            parent_div.appendChild(time);
            parent_div.appendChild(likes);

            parent_div.style.borderTop = 'solid';
            parent_div.style.padding = '1%'

            document.querySelector('#posts-view').appendChild(parent_div)

        }

    });

  }


  function prof_posts(user){

    fetch(`/prof_posts/${user}`)
    .then(response => response.json())
    .then(posts => {

        for (let i = 0; i < posts.length; i++)
        {

            let parent_div = document.createElement('div');
            let creator = document.createElement('h6');
            let content = document.createElement('h5');
            let time = document.createElement('p');
            let likes = document.createElement('p')

            //creator.innerHTML = (`${posts[i]['creator']} said: `);
            creator.innerHTML = posts[i]['creator']
            content.innerHTML = posts[i]['content'];
            time.innerHTML = posts[i]['timestamp'];
            likes.innerHTML = ('Likes: ' + posts[i]['likes'].length);

            creator.addEventListener("click", function() {
              view_profile(posts[i]['creator'])
            });

            parent_div.appendChild(creator);
            parent_div.appendChild(content);
            parent_div.appendChild(time);
            parent_div.appendChild(likes);

            parent_div.style.borderTop = 'solid';
            parent_div.style.padding = '1%'

            document.querySelector('#posts-view').appendChild(parent_div)

        }

    });

  }  
  //all posts should just be the default homepage
  //following should hide all posts and show following
  //all posts will always refresh because it is a view

  //make new a view

  //make profile a view

  //have the eq of path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
    // either return all, or followed by filtered by user
