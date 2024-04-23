// document.getElementById('theme-toggle').addEventListener('click', function () {
// 	// const bodyClass = document.body.classList;
// 	// bodyClass.toggle('dark');

// 	// // Opcionalno: Sačuvajte korisnikov izbor u localStorage
// 	// if (bodyClass.contains('dark')) {
// 	// localStorage.setItem('theme', 'dark');
// 	// } else {
// 	// localStorage.setItem('theme', 'light');
// 	// }

// 	const docEl = document.documentElement;
// 	if (docEl.getAttribute('data-theme') === "light" || docEl.getAttribute('data-theme') == null || docEl.getAttribute('data-theme') == "") {
// 		docEl.setAttribute('data-theme', 'dark');
// 		localStorage.setItem('theme', 'dark');
// 	} else {
// 		docEl.setAttribute('data-theme', 'light');
// 		localStorage.setItem('theme', 'light');
// 	}
// });

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

document.querySelectorAll('.tabs .tab').forEach((tab, index) => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.tabs .tab').forEach(node => node.classList.remove('tab-active'));
		tab.classList.add('tab-active');
		document.querySelectorAll('#content1, #content2, #content3, #content4').forEach(content => {
			content.classList.add('hidden');
		});
		document.querySelector(`#content${index + 1}`).classList.remove('hidden');
	});
});

window.electronAPI.onDataFetched((data) => {
	// Uzimanje referenci na kontejner
	const container = document.getElementById('data-container');

	// Brisanje prethodnih podataka
	container.innerHTML = '';

	// Kreiranje tabele
	const table = document.createElement('table');
	table.className = 'table';

	// Kreiranje i popunjavanje zaglavlja tabele
	const thead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	const headers = [ "ID", "Username", "Password", "Is Logged" ];
	headers.forEach(text => {
		const th = document.createElement('th');
		th.textContent = text;
		headerRow.appendChild(th);
	});
	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Kreiranje tela tabele
	const tbody = document.createElement('tbody');

	data.forEach(row => {
		const tr = document.createElement('tr');
		tr.className = 'hover';

		// Kreiranje i dodavanje ćelija za ID
		const tdId = document.createElement('td');
		tdId.textContent = row.id;
		tr.appendChild(tdId);

		// Kreiranje i dodavanje ćelija za Username
		const tdUsername = document.createElement('td');
		tdUsername.textContent = row.username;
		tr.appendChild(tdUsername);

		// Kreiranje i dodavanje ćelija za Password
		const tdPassword = document.createElement('td');
		tdPassword.textContent = row.password;
		tr.appendChild(tdPassword);

		// Kreiranje i dodavanje ćelija za Is Logged
		const tdIsLogged = document.createElement('td');
		tdIsLogged.textContent = row.is_logged;
		tr.appendChild(tdIsLogged);

		// Dodavanje reda u telo tabele
		tbody.appendChild(tr);
	});

	// Dodavanje tela tabele u tabelu
	table.appendChild(tbody);

	// Dodavanje kompletne tabele u kontejner
	container.appendChild(table);
});