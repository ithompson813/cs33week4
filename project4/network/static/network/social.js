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

      //create elements to represent post
      profile_details = document.createElement('div');
      prof_name = document.createElement('h1');
      num_followers = document.createElement('p');
      num_following = document.createElement('p');

      //update heading
      prof_name.innerHTML = (user.name + "'s Profile:");

      //fill elements with data from user
      num_following.innerHTML=(`Followers: ${user.followers.length}`);
      num_followers.innerHTML=(`Following: ${user.following.length}`);

      //add elements to details view on site
      profile_details.appendChild(prof_name);
      profile_details.appendChild(num_following);
      profile_details.appendChild(num_followers);
      
      //create a button to track follows/unfollows
      follow_button = document.createElement('button');

      //track current user
      current_user = document.querySelector('#profile').innerText;

      //if user is already following profile, give them an unfollow option
      if (user.followers.includes(current_user)){

        follow_button.innerHTML="Unfollow This User";
        follow = false;

      //if user is not following, give option to follow
      } else {

        follow_button.innerHTML="Follow This User";
        follow = true;

      }

      // add onclick event to trigger follow function
      follow_button.addEventListener("click", function(){

        // note that the boolean 'follow' determines to either follow or unfollow in the follow function
        current_user = document.querySelector('#profile').innerText;
        follow_user(user, current_user, follow);

      })

      // dont show the button if user is viewing own profile
      if (current_user != user.name){
        profile_details.appendChild(follow_button);
      }

      document.querySelector('#profile_details').appendChild(profile_details);
    });


    // get posts related to the user
    prof_posts(user);
    
  }

  // the get posts function makes an API request and returns either all posts or just
  // posts from users that the current user follows after interacting with the posts view
  function get_posts(posts){

    fetch(`/posts/${posts}`)
    .then(response => response.json())
    .then(posts => {

        for (let i = 0; i < posts.length; i++)
        {

          // create elements 
          let parent_div = document.createElement('div');
          let creator = document.createElement('h2');
          let content = document.createElement('h5');
          let time = document.createElement('p');
          let likes = document.createElement('p')

          // write data to elements
          creator.innerHTML = (`${posts[i]['creator']} said: `);
          content.innerHTML = posts[i]['content'];
          time.innerHTML = posts[i]['timestamp'];
          likes.innerHTML = ('Likes: ' + posts[i]['likes'].length);

          // add the ability to click a username and be taken to their profile
          creator.addEventListener("click", function() {
            view_profile(posts[i]['creator'])
          });

          // write elements to the parent div which represents a post
          parent_div.appendChild(creator);
          parent_div.appendChild(content);
          parent_div.appendChild(time);
          parent_div.appendChild(likes);

          // add a little padding and a border
          parent_div.style.borderTop = 'solid';
          parent_div.style.padding = '1%';

          // if the post was made by the current user
          if (posts[i]['creator'] === document.querySelector('#profile').innerText){
              
            // add an edit button
            edit_button = document.createElement('button');
            edit_button.innerHTML = 'Edit Post';

            // the edit button pops up a textarea and a save button when clicked
            edit_button.addEventListener('click', function(){

              saved_content = content.innerHTML;
              parent_div.removeChild(content);

              new_content = document.createElement('textarea');
              new_content.innerHTML = saved_content;
              parent_div.append(new_content);

              save_button = document.createElement('button');
              save_button.innerHTML = "Save";

              // the save button triggers the event function to edit the post when clicked
              save_button.addEventListener('click', function() {

                edit_post(posts[i]['id'], new_content.value);

                //cheating a bit and reloading, but its 11:30pm and I'm basically out of time
                location.reload();
              })

              parent_div.appendChild(save_button)

            })
              
            parent_div.appendChild(edit_button);

          }


          like_button = document.createElement('button');
          
          if (posts[i]['likes'].includes(document.querySelector('#profile').innerText)){
            like_button.innerHTML = "Unlike"
          } else {
            like_button.innerHTML = "Like"
          }

          like_button.addEventListener('click', function() {

            //send info to like_post function which will make the API call
            like_post(posts[i], document.querySelector('#profile').innerText);

            //see above
            location.reload();

          })

          parent_div.appendChild(like_button);

          // write post to posts-view of main page
          document.querySelector('#posts-view').appendChild(parent_div);

        }

    });

  }


  // the prof_posts function gets posts only made by the user of the current view's profile
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


// the follow user function adds the user to the current user's follow list through an API call
function follow_user(user, current_user, follow){

  // the boolean follow is passed in from the follow function and determines whether to
  // follow or unfollow a user

  if (follow){
    fetch(`/follow`, {
      method: 'POST',
      body: JSON.stringify({

        user: user,
        current_user: current_user

      })
   })
  }

  else {
    fetch(`/unfollow`, {
      method: 'POST',
      body: JSON.stringify({
  
        user: user,
        current_user: current_user
  
      })
    })
  }
}


// the edit function updates a post's content through an API call
function edit_post(post, content){

  fetch(`edit`, {

    method: 'POST',
    body: JSON.stringify({

      post: post,
      content: content

    })

  });

}



// the follow user function adds the user to the current user's follow list through an API call
function like_post(post, user){

  fetch(`/like`, {
    method: 'POST', 
    body: JSON.stringify({

      post: post,
      user: user

    })
  })
  

}