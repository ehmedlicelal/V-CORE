async function loadTeamMembers() {
  const response = await fetch("http://127.0.0.1:5000/api/team");
  const data = await response.json();

  const teamGrid = document.querySelector(".team-grid");

  teamGrid.innerHTML = "";

  data.forEach(member => {
    teamGrid.innerHTML += `
      <div class="team-card">
        <div class="team-image">${member.initial}</div>
        <h3>${member.name}</h3>
        <p>${member.contribution}</p>
      </div>
    `;
  });
}

loadTeamMembers();