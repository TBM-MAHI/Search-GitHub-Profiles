import { CLIENT_SECRET,CLIENT_ID } from "./key.js";
let search = document.getElementById("search");
let form = document.getElementById("form");
let main = document.getElementById("main");
let load = document.getElementById("loading");

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
         </div>
    </div>`;
  main.innerHTML = userCard;
  if (socialURLtags) {
        let connect = document.createElement("div");
        connect.setAttribute("class", "connect");
        let socpar = document.createElement("p");
        socpar.setAttribute("class", "repo");
        socpar.innerText = "Socials:";
        connect.insertAdjacentElement("afterbegin", socpar);
        connect.insertAdjacentHTML("beforeend", socialURLtags);
        // console.log(connect);
        main.children[0].children[1].insertAdjacentElement("beforeend", connect);
    }
     main.style.display = "block";
     load.style.display = "none";
}
async function createReposCard(reposURL) {
  let repoURLtags = ``;
  try {
    let { data } = await axios.get(`${reposURL}?sort=updated`);
    data.slice(0, 9).forEach((repo) => {
      repoURLtags =
        repoURLtags +
        `<a href="${repo.html_url}" 
            class="repo"
              target='_blank'>${repo.name}
              </a>`;
    });
    return repoURLtags;
  } catch (err) {
    console.log(err);
  }
}

async function createSocials(login) {
  let { data } = await axios.get(
    `https://api.github.com/users/${login}/social_accounts`
  );
  let socialURLtags = ``;
  data.forEach((elem) => {
    socialURLtags += `<a href="${elem.url}" class="repo" target='_blank'><i class="fab fa-${elem.provider}"></i></a>`;
  });
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
    main.style.display = "none";
    load.style.display = "block";
    let profileName = search.value;
    console.log(search.value);
    getUserdata(profileName);
    search.value = "";
})
