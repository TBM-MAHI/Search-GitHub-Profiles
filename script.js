const CLIENT_ID = "f3458ae48e1dd8666835";
const CLIENT_SECRET = "86f1dc2cd633c86227010412c5c6c4285fda9570";

let search = document.getElementById("search");
let form = document.getElementById("form");
let main = document.getElementById("main");

async function getUserdata(profileName) {
  try {
    let { data } = await axios.get(
      `https://api.github.com/users/${profileName}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    );
    createUsercard(data);
  } catch (err) {
    if (err.response.status === 404)
      ceateErrorCard("No profile with this User Name");
    else ceateErrorCard("Sorry bad requset try again");
  }
}
async function createUsercard(userData) {
    let following = await axios.get(
      `https://api.github.com/users/${userData.login}/following`
    );
    
    let followers = await axios.get(
      `https://api.github.com/users/${userData.login}/followers`
    );
   
    let repoURLtags = await createReposCard(userData.repos_url);
    let socialURLtags = await createSocials(userData.login);
    // console.log(repoURLtags);
    let userCard = `
     <div class="card">
        <div>
            <img src=${userData.avatar_url} alt="avatar" class="avatar">

        </div>
        <div class="user-info">
            <h2>${userData.name}</h2>
            <p>${userData.bio}</p>
            <ul>
                <li>${followers.data.length}<strong>Followers</strong></li>
                <li>${following.data.length}<strong>Following</strong></li>
                <li>${userData.public_repos}<strong>Repos</strong></li>
            </ul>
            <div class="repos">
            <p class='repo'>repositories:</p>
               ${repoURLtags}
            </div>
            <div class="connect">${socialURLtags}</div>
        </div>
    </div>`;
    main.innerHTML = userCard;
}
async function createReposCard(reposURL) {
  let repoURLtags = ``;
  try {
    let { data } = await axios.get(`${reposURL}?sort=updated`);
    data.slice(0,9).forEach((repo) => {
      repoURLtags =
        repoURLtags +
        `<a href="${repo.html_url}" 
              class="repo"
              target='_blank'>${repo.name}
              </a>`;
    });
    return repoURLtags;
  }
  catch (err) {console.log(err) }
}

async function createSocials(login) {
  let { data } = await axios.get(
    `https://api.github.com/users/${login}/social_accounts`
  );
  let socialURLtags = ``;
  data.forEach((elem) => {
    socialURLtags += `<a href="${elem.url}" target='_blank'><i class="fab fa-${elem.provider}"></i>
                 </a>`;
  });
    console.log(socialURLtags);
  return socialURLtags;
}

function ceateErrorCard(msg) {
  let errorCard = `
     <div class="card">
      <h1>${msg}</h1>
     </div>
    `;
  main.innerHTML = errorCard;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let profileName = search.value;
  console.log(search.value);
  getUserdata(profileName);
  // search.value = "";
});
