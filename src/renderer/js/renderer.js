
// Promena teme
document.getElementById('theme-toggle').addEventListener('click', function () {
	const docEl = document.documentElement;
	if (docEl.getAttribute('data-theme') === "emerald" || docEl.getAttribute('data-theme') == null || docEl.getAttribute('data-theme') == "") {
		docEl.setAttribute('data-theme', 'dark');
		localStorage.setItem('theme', 'dark');
	} else {
		docEl.setAttribute('data-theme', 'emerald');
		localStorage.setItem('theme', 'emerald');
	}
});

// Provera localStorage za postavljenu temu na učitavanju
document.addEventListener('DOMContentLoaded', () => {
	if (localStorage.getItem('theme') === 'emerald' || (!('theme' in localStorage) && !(window.matchMedia('(prefers-color-scheme: dark)').matches))) {
		document.documentElement.setAttribute('data-theme', 'emerald');
		// document.body.classList.add('dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'dark');
		// document.body.classList.remove('dark');
	}
});

// Slanje zahteva za preuzimanje podataka iz baze
document.getElementById('fetchData').addEventListener('click', () => {
	window.electronAPI.fetchData('users');
});

// Primanje podataka iz baze
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

// Ubacivanje podataka u bazu
document.getElementById('insertData').addEventListener('click', () => {
	const data = {
		id: null,
		username: 'simaks',
		password: 'simaks123',
		is_logged: 0
	};
	window.electronAPI.insertData('users', data);
});

// Postavljanje layouta sa tabovima
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

// Zatvaranje prozora
document.querySelectorAll('[role=closeWindow]').forEach(el => {
	el.addEventListener('click', closeWindow);
});

function closeWindow() {
	window.electronAPI.closeWindow();
}

// Minimizovanje prozora
document.querySelectorAll('[role=minimizeWindow]').forEach(el => {
	el.addEventListener('click', minimizeWindow);
});

function minimizeWindow() {
	window.electronAPI.minimizeWindow();
}

// Maksimizovanje prozora
document.querySelectorAll('[role=maximizeWindow]').forEach(el => {
	el.addEventListener('click', maximizeWindow);
});

function maximizeWindow() {
	toggleMaximize();
	window.electronAPI.maximizeWindow();
}

// Unmaksimizovanje prozora
document.querySelectorAll('[role=unmaximizeWindow]').forEach(el => {
	el.addEventListener('click', unmaximizeWindow);
});

function unmaximizeWindow() {
	toggleMaximize();
	window.electronAPI.unmaximizeWindow();
}

function toggleMaximize() {
	const maximize = document.querySelectorAll('[role=maximizeWindow]');
	const unmaximize = document.querySelectorAll('[role=unmaximizeWindow]');
	maximize.forEach(el => {
		if (el.classList.contains('hidden')) {
			el.classList.remove('hidden');
		} else {
			el.classList.add('hidden');
		}
	});
	unmaximize.forEach(el => {
		if (el.classList.contains('hidden')) {
			el.classList.remove('hidden');
		} else {
			el.classList.add('hidden');
		}
	});
}