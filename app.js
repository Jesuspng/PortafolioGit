const API_URLS = {
    user: `https://api.github.com/users/Jesuspng`,
    repos: `https://api.github.com/users/Jesuspng/repos?sort=updated&per_page=9&type=owner&direction=desc`,
    followers: `https://api.github.com/users/Jesuspng/followers?per_page=6`
};

const loadingElement = document.getElementById('loading');
const mainLayout = document.querySelector('.contenedor');
const profileSection = document.getElementById('profile');
const projectsGrid = document.getElementById('projects');
const followersGrid = document.getElementById('followers');

async function initPortfolio() {
    try {
        const [userData, reposData, followersData] = await Promise.all([
            fetchData(API_URLS.user),
            fetchData(API_URLS.repos),
            fetchData(API_URLS.followers)
        ]);

        renderProfile(userData);
        renderProjects(reposData);
        renderFollowers(followersData);

        loadingElement.style.display = 'none';
        mainLayout.style.display = 'grid';

    } catch (error) {
        showError(error.message);
    }
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`No se pudo conectar con GitHub: ${error.message}`);
    }
}

function renderProfile(user) {
    const profileHTML = `
        <img src="${user.avatar_url}" alt="${user.name}" class="profile-avatar">
        <div class="profile-info">
            <h1>${user.name || user.login}</h1>
            <p class="bio">${user.bio || 'Desarrollador de Software'}</p>
            <div class="profile-stats">
                <div class="stat">
                    <span  >${user.public_repos}</span>
                    <span  >Repositorios</span>
                </div>
                <div class="stat">
                    <span  >${user.followers}</span>
                    <span  >Seguidores</span>
                </div>
                <div class="stat">
                    <span  >${user.following}</span>
                    <span  >Siguiendo</span>
                </div>
            </div>
        </div>
    `;
    
    profileSection.innerHTML = profileHTML;
}

function renderProjects(repos) {
    if (repos.length === 0) {
        projectsGrid.innerHTML = '';
        return;
    }

    projectsGrid.innerHTML = repos.map(repo => {
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="project-card" onclick="window.open('${repo.html_url}', '_blank')">
                <h3>${repo.name}</h3>
                <p class="description">${repo.description || 'Sin descripción disponible'}</p>
                <div class="project-meta">
                    ${repo.language ? `<span>${repo.language}</span>` : ''}
                    <span>${updatedDate}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderFollowers(followers) {
    if (followers.length === 0) {
        followersGrid.innerHTML = '<p style="color: #666;">Aún no tienes seguidores.</p>';
        return;
    }

    followersGrid.innerHTML = followers.map(follower => `
        <div class="follower-card">
            <a href="${follower.html_url}" target="_blank">
                <img src="${follower.avatar_url}" alt="${follower.login}" class="follower-avatar">
                <p class="follower-username">@${follower.login}</p>
            </a>
        </div>
    `).join('');
}

function showError(message) {
    loadingElement.innerHTML = `
        <div class="error">
            <h3>Error al cargar el portafolio</h3>
            <p>${message}</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">
                Verifica que el usuario <strong>Jesuspng</strong> exista en GitHub.
            </p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initPortfolio);