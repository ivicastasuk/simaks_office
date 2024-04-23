document.getElementById('theme-toggle').addEventListener('click', function() {
	const bodyClass = document.body.classList;
	bodyClass.toggle('dark');

	// Opcionalno: Sačuvajte korisnikov izbor u localStorage
	if (bodyClass.contains('dark')) {
	localStorage.setItem('theme', 'dark');
	} else {
	localStorage.setItem('theme', 'light');
	}
});

// Provera localStorage za postavljenu temu na učitavanju
document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
	document.body.classList.add('dark');
	} else {
	document.body.classList.remove('dark');
	}
});

document.getElementById('fetchData').addEventListener('click', () => {
    window.electronAPI.fetchData();
});

document.getElementById('insertData').addEventListener('click', () => {
	const data = {
		id: null,
		username: 'simaks',
		password: 'simaks123',
		is_logged: 0
	};
    window.electronAPI.insertData('users', data);
});

window.electronAPI.onDataFetched((data) => {
    const container = document.getElementById('data-container');
    container.innerHTML = '';  // Očistite prethodne podatke
    data.forEach(row => {
        const rowElement = document.createElement('p');
		rowElement.setAttribute('class', 'text-dark dark:text-light');
        rowElement.textContent = `ID: ${row.id}, Name: ${row.username}, Password: ${row.password}, IsLogged: ${row.is_logged}`;
        container.appendChild(rowElement);
    });
});