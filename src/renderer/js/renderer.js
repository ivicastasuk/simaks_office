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

// Login forma
document.getElementById('loginForm').addEventListener('submit', async (event) => {
	event.preventDefault(); // Prevent default form submission behavior

	const username = event.target.username.value;
	const password = event.target.password.value;

	// Validate input
	if (!username || !password) {
		Swal.fire({
			title: 'Greška',
			text: 'Unesite korisničko ime i lozinku.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		return;
	}

	try {
		// Send login request to the server
		const response = await fetch('http://simaks/api/login.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		const result = await response.json();

		if (response.ok && result.success) {
			// console.log('Login successful:', result);
			// Store the token and user data
			window.authToken = result.token;
			window.currentUser = result.user;

			// Hide login form and show main content
			document.getElementById('login-container').classList.add('hidden');
			document.getElementById('login-container').classList.remove('flex');
			document.getElementById('main-content').classList.remove('hidden');
			document.getElementById('main-content').classList.add('flex');

			// Optionally, display user profile information
			displayUserProfile(result.user);
			saveLoggedUser(result.user);

			// Pozivanje funkcije za iscitavanja podesavanja
			fetchAndSaveSettings(result.user.company_id).then(() => {
				displayCompanySettings();
				importTemplate('ponuda');
			});

		} else {
			console.error('Login failed:', result.message);
			Swal.fire({
				title: 'Greška',
				text: 'Neuspešna prijava: ' + result.message,
				icon: 'error',
				confirmButtonText: 'OK',
			});
		}
	} catch (error) {
		console.error('Error during login:', error);
		Swal.fire({
			title: 'Greška',
			text: 'Došlo je do greške prilikom prijave.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
	}
});

// Event listener za snimanje podataka o korisniku
document.getElementById('userUpdate').addEventListener('click', async () => {
	let user = JSON.parse(localStorage.getItem('user'));
	const userId = user.id;
	const updatedData = {
		username: document.querySelector("input[name='userUsername']").value,
		email: document.querySelector("input[name='userEmail']").value,
		first_name: document.querySelector("input[name='userFirstName']").value,
		last_name: document.querySelector("input[name='userLastName']").value,
		phone: document.querySelector("input[name='userPhone']").value,
	};

	// Validacija podataka
	if (!updatedData.username || !updatedData.email || !updatedData.first_name || !updatedData.last_name || !updatedData.phone) {
		Swal.fire({
			title: 'Greška',
			text: 'Popunite sva obavezna polja...',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		return;
	}

	const tableName = 'users';
	const conditionString = 'id = ?';
	const conditionValues = [ userId ];

	// Slanje zahteva za azuriranje
	window.electronAPI.updateUser({ tableName, data: updatedData, conditionString, conditionValues });
});

window.electronAPI.onUserUpdated((result) => {
	console.log('User updated successfully:', result);
	Swal.fire({
		title: 'Uspeh',
		text: 'Korisnik je uspešno ažuriran!',
		icon: 'success',
		confirmButtonText: 'OK',
	});
});

// Event listener za snimanje podataka o firmi
document.getElementById('companyUpdate').addEventListener('click', async () => {
	// Preuzimanje podataka iz input polja za kompaniju
	let company = JSON.parse(localStorage.getItem('settings'));
	const companyId = company.id;
	const updatedData = {
		company: document.querySelector("input[name='companyName']").value,
		address: document.querySelector("input[name='companyAddress']").value,
		city: document.querySelector("input[name='companyCity']").value,
		pib: document.querySelector("input[name='companyPIB']").value,
		mb: document.querySelector("input[name='companyMB']").value,
		phone: document.querySelector("input[name='companyPhone']").value,
		website: document.querySelector("input[name='companyUrl']").value,
		// logo: document.querySelector("input[name='companyLogo']").value,
	};

	// Validacija podataka
	if (!updatedData.company || !updatedData.address || !updatedData.city || !updatedData.pib || !updatedData.mb || !updatedData.phone) {
		Swal.fire({
			title: 'Greška',
			text: 'Popunite sva obavezna polja...',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		return;
	}

	const tableName = 'settings';
	const conditionString = 'id = ?';
	const conditionValues = [ companyId ];

	// Slanje zahteva za azuriranje
	window.electronAPI.updateCompany({ tableName, data: updatedData, conditionString, conditionValues });
});

window.electronAPI.onCompanyUpdated((result) => {
	console.log('Company updated successfully:', result);
	Swal.fire({
		title: 'Uspeh',
		text: 'Podešavanja su uspešno ažurirana!',
		icon: 'success',
		confirmButtonText: 'OK',
	});
});

// Listen for the 'settings-fetched' event
window.electronAPI.onSettingsFetched((settingsData) => {
	if (settingsData.length > 0) {
		// Pretpostavljamo da postoji samo jedan red sa podešavanjima za svaku kompaniju
		const settings = settingsData[ 0 ];
		localStorage.setItem('settings', JSON.stringify(settings));
	} else {
		console.warn('No settings found for this company.');
	}
});

// Slanje zahteva za preuzimanje podataka o artiklima iz baze
document.getElementById('fetchData').addEventListener('click', () => {
	window.electronAPI.fetchData('products');
});

// Slanje zahteva za preuzimanje podataka o klijentima iz baze
document.getElementById('fetchClients').addEventListener('click', () => {
	window.electronAPI.fetchClients('clients');
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
	const headers = [ "Šifra", "Tip", "Proizvođač", "Naziv", "Oznaka", "Slika", "Opis", "Stavke", "JM", "Cena" ];
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

		// Kreiranje i dodavanje ćelija za sifru
		const tdCode = document.createElement('td');
		tdCode.textContent = row.code;
		tr.appendChild(tdCode);

		// Kreiranje i dodavanje ćelija za tip
		const tdType = document.createElement('td');
		tdType.textContent = row.type;
		tr.appendChild(tdType);

		// Kreiranje i dodavanje ćelija za proizvodjaca
		const tdManufacturer = document.createElement('td');
		tdManufacturer.textContent = row.manufacturer;
		tr.appendChild(tdManufacturer);

		// Kreiranje i dodavanje ćelija za naziv
		const tdName = document.createElement('td');
		tdName.textContent = row.name;
		tr.appendChild(tdName);

		// Kreiranje i dodavanje ćelija za model
		const tdModel = document.createElement('td');
		tdModel.textContent = row.model;
		tr.appendChild(tdModel);

		// Kreiranje i dodavanje ćelija za sliku
		const tdImage = document.createElement('td');
		tdImage.innerHTML = `<img src="http://simaks/img/products/${row.img_url}" class="w-12 h-12 border">`;
		tr.appendChild(tdImage);

		// Kreiranje i dodavanje ćelija za opis
		const tdDescription = document.createElement('td');
		tdDescription.textContent = row.description;
		tr.appendChild(tdDescription);

		// Kreiranje i dodavanje ćelija za stavke
		const tdItems = document.createElement('td');
		tdItems.textContent = row.items;
		tr.appendChild(tdItems);

		// Kreiranje i dodavanje ćelija za jm
		const tdUnit = document.createElement('td');
		tdUnit.textContent = row.unit;
		tr.appendChild(tdUnit);

		// Kreiranje i dodavanje ćelija za cenu
		const tdPrice = document.createElement('td');
		tdPrice.textContent = parseFloat(row.price).toFixed(2);
		tdPrice.setAttribute('class', 'text-right');
		tr.appendChild(tdPrice);

		// Dodavanje reda u telo tabele
		tbody.appendChild(tr);
	});

	// Dodavanje tela tabele u tabelu
	table.appendChild(tbody);

	// Dodavanje kompletne tabele u kontejner
	container.appendChild(table);
});

// Primanje podataka o klijentima iz baze
window.electronAPI.onClientsFetched((data) => {
	// Uzimanje referenci na kontejner
	const container = document.getElementById('clients-container');

	// Brisanje prethodnih podataka
	container.innerHTML = '';

	// Kreiranje tabele
	const table = document.createElement('table');
	table.className = 'table';

	// Kreiranje i popunjavanje zaglavlja tabele
	const thead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	const headers = [ "Naziv firme", "Adresa", "Grad", "PIB", "MB" ];
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

		// Kreiranje i dodavanje ćelija za naziv
		const tdName = document.createElement('td');
		tdName.textContent = row.name;
		tr.appendChild(tdName);

		// Kreiranje i dodavanje ćelija za adresu
		const tdAddress = document.createElement('td');
		tdAddress.textContent = row.address;
		tr.appendChild(tdAddress);

		// Kreiranje i dodavanje ćelija za grad
		const tdCity = document.createElement('td');
		tdCity.textContent = row.city;
		tr.appendChild(tdCity);

		// Kreiranje i dodavanje ćelija za pib
		const tdPIB = document.createElement('td');
		tdPIB.textContent = row.pib;
		tr.appendChild(tdPIB);

		// Kreiranje i dodavanje ćelija za mb
		const tdMB = document.createElement('td');
		tdMB.textContent = row.mb;
		tr.appendChild(tdMB);

		// Dodavanje reda u telo tabele
		tbody.appendChild(tr);
	});

	// Dodavanje tela tabele u tabelu
	table.appendChild(tbody);

	// Dodavanje kompletne tabele u kontejner
	container.appendChild(table);
});

// Ubacivanje podataka u bazu
document.querySelectorAll('button[name=insertData]').forEach((button, index) => {
	button.addEventListener('click', async () => {
		const code = document.querySelector("input[name=code]").value;
		const type = document.querySelector("select[name=type]").value;
		const manufacturer = document.querySelector("input[name=manufacturer]").value;
		const name = document.querySelector("input[name=name]").value;
		const model = document.querySelector("input[name=model]").value;
		// Use the uploaded image name or a default value
		const image = window.uploadedImageName || "dummy.jpg";
		const description = document.querySelector("textarea[name=description]").value;
		// const items = document.querySelector("input[name=items]").value;
		const unit = document.querySelector("select[name=units]").value;
		const price = document.querySelector("input[name=price]").value;

		if (!code || !name || !model) {
			Swal.fire({
				title: 'Greška',
				text: 'Popunite sva obavezna polja...',
				icon: 'error',
				confirmButtonText: 'OK'
			});
			return;
		}

		const data = {
			id: null,
			code: code,
			type: type,
			manufacturer: manufacturer,
			name: name,
			model: model,
			img_url: image,
			description: description,
			// items: items,
			unit: unit,
			price: price
		};

		try {
			const result = await window.electronAPI.insertData('products', data);
			Swal.fire({
				title: 'Info',
				text: 'Proizvod je uspesno dodan u bazu!',
				icon: 'info',
				confirmButtonText: 'OK'
			});
		} catch (error) {
			console.error('Error inserting data:', error);
			Swal.fire({
				title: 'Greška',
				text: 'Greška prilikom dodavanja podatak u bazu!',
				icon: 'error',
				confirmButtonText: 'OK'
			});
		}
	});
});

// Ubacivanje podataka o klijentima u bazu
document.querySelectorAll('button[name=insertClient]').forEach((button, index) => {
	button.addEventListener('click', async () => {
		const clientName = document.querySelector("input[name=clientName]").value;
		const clientAddress = document.querySelector("input[name=clientAddress]").value;
		const clientCity = document.querySelector("input[name=clientCity]").value;
		const clientPIB = document.querySelector("input[name=clientPIB]").value;
		const clientMB = document.querySelector("input[name=clientMB]").value;

		if (!clientName) {
			Swal.fire({
				title: 'Greška',
				text: 'Popunite sva obavezna polja...',
				icon: 'error',
				confirmButtonText: 'OK'
			});
			return;
		}

		const data = {
			id: null,
			name: clientName,
			address: clientAddress,
			city: clientCity,
			pib: clientPIB,
			mb: clientMB,
		};

		try {
			const result = await window.electronAPI.insertData('clients', data);
			Swal.fire({
				title: 'Info',
				text: 'Klijent je uspesno dodan u bazu!',
				icon: 'info',
				confirmButtonText: 'OK'
			});
		} catch (error) {
			console.error('Error inserting data:', error);
			Swal.fire({
				title: 'Greška',
				text: 'Greška prilikom dodavanja klijenta u bazu!',
				icon: 'error',
				confirmButtonText: 'OK'
			});
		}
	});
});

// Postavljanje layouta sa tabovima
document.querySelectorAll('.tabs .tab').forEach((tab, index) => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.tabs .tab').forEach(node => node.classList.remove('tab-active'));
		tab.classList.add('tab-active');
		document.querySelectorAll('#content1, #content2, #content3, #content4, #content5').forEach(content => {
			content.classList.add('hidden');
			content.classList.remove('flex');
		});
		const activeContent = document.querySelector(`#content${index + 1}`);
		activeContent.classList.remove('hidden');
		activeContent.classList.add('flex');

		if (`content${index + 1}` === 'content1') {
			window.electronAPI.fetchUser('users');
		}
	});
});

// Zatvaranje prozora
document.querySelectorAll('[role=closeWindow]').forEach(el => {
	el.addEventListener('click', closeWindow);
	localStorage.removeItem('user');
	localStorage.removeItem('settings');
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

document.getElementById("imageContainer").addEventListener("click", openFileDialog);
// document.getElementById("imgInput").addEventListener("change", previewImage);

function openFileDialog() {
	document.getElementById("imgInput").click();
}

function previewImage() {
	const file = document.getElementById('imgInput').files[ 0 ];
	if (!file) {
		console.log('Nijedan fajl nije izabran.');
		return;
	}

	const reader = new FileReader();

	reader.onload = function (e) {
		document.getElementById('imageContainer').style.backgroundImage = `url(${e.target.result})`;
	};

	reader.onerror = function (e) {
		console.error('Došlo je do greške pri čitanju fajla:', e);
	};

	reader.readAsDataURL(file);
}

// Function to handle image upload
async function uploadImage(file) {
	const formData = new FormData();
	formData.append('image', file);

	try {
		const response = await fetch('http://simaks/api/upload-image.php', {
			method: 'POST',
			body: formData,
		});

		const result = await response.json();

		if (response.ok && result.success) {
			console.log('Image uploaded successfully:', result);
			// Update the image preview
			document.getElementById('imagePreview').src = URL.createObjectURL(file);
			return result.filename; // Return the image file name from the server response
		} else {
			console.error('Error uploading image:', result.message);
			Swal.fire({
				title: 'Error',
				text: 'Failed to upload image: ' + result.message,
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return null;
		}
	} catch (error) {
		console.error('Error uploading image:', error);
		Swal.fire({
			title: 'Error',
			text: 'An unexpected error occurred while uploading the image.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		return null;
	}
}

// Event listener for image input change
document.getElementById('imgInput').addEventListener('change', async function (event) {
	const file = event.target.files[ 0 ];
	if (!file) {
		return;
	}

	// Upload the image to the server
	const imageName = await uploadImage(file);

	if (imageName) {
		// Store the image name for later use
		window.uploadedImageName = imageName;
	}
});

// SweetAlert2 funkcije
function showAlert() {
	window.sweetAlert.fire({
		title: 'Da li ste sigurni?',
		text: 'Nećete moći da povratite ovu fiktivnu datoteku!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Da, obriši je!'
	}).then((result) => {
		if (result.isConfirmed) {
			window.sweetAlert.fire({
				title: 'Obrisano!',
				text: 'Vaša fiktivna datoteka je obrisana.',
				icon: 'success'
			});
		}
	});
}

function showToast() {
	window.sweetAlert.toast({
		title: 'Obaveštenje',
		text: 'Ovo je primer toast poruke'
	});
}

// Funkcija za prikazivanje podataka o korisniku
function displayUserProfile(user) {
	// Reference to the profile container
	const profileContainer = document.getElementById('content1');

	document.querySelector('input[name=userUsername]').value = '';
	document.querySelector('input[name=userPassword]').value = '';
	document.querySelector('input[name=userFirstName]').value = '';
	document.querySelector('input[name=userLastName]').value = '';
	document.querySelector('input[name=userEmail]').value = '';
	document.querySelector('input[name=userPhone]').value = '';

	document.querySelector('input[name=userUsername]').value = user.username;
	// document.querySelector('input[name=userPassword]').value = user.password;
	document.querySelector('input[name=userFirstName]').value = user.first_name;
	document.querySelector('input[name=userLastName]').value = user.last_name;
	document.querySelector('input[name=userEmail]').value = user.email;
	document.querySelector('input[name=userPhone]').value = user.phone;

	// Make content1 visible
	profileContainer.classList.remove('hidden');
	profileContainer.classList.add('flex');
}

function fetchAndSaveSettings(companyId) {
	return new Promise((resolve, reject) => {
		// Slanje zahteva Electron back-endu
		window.electronAPI.fetchSettings(companyId);

		// Slušamo događaj kada su podešavanja uspešno dohvaćena
		window.electronAPI.onSettingsFetched((settingsData) => {
			if (settingsData.length > 0) {
				// Pretpostavljamo da postoji samo jedan red sa podešavanjima za svaku kompaniju
				const settings = settingsData[ 0 ];
				localStorage.setItem('settings', JSON.stringify(settings));
				resolve(); // Signaliziramo da su podaci uspešno sačuvani
			} else {
				console.warn('No settings found for this company.');
				reject(new Error('No settings found.'));
			}
		});
	});
}

async function displayCompanySettings() {
	document.querySelector('input[name=companyName]').value = '';
	document.querySelector('input[name=companyAddress]').value = '';
	document.querySelector('input[name=companyCity]').value = '';
	document.querySelector('input[name=companyPIB]').value = '';
	document.querySelector('input[name=companyMB]').value = '';
	document.querySelector('input[name=companyPhone]').value = '';
	document.querySelector('input[name=companyUrl]').value = '';
	document.getElementById('companyLogo').src = 'http://simaks/img/logo.jpg';

	const settings = JSON.parse(localStorage.getItem("settings"));

	document.querySelector('input[name=companyName]').value = settings.company;
	document.querySelector('input[name=companyAddress]').value = settings.address;
	document.querySelector('input[name=companyCity]').value = settings.city;
	document.querySelector('input[name=companyPIB]').value = settings.pib;
	document.querySelector('input[name=companyMB]').value = settings.mb;
	document.querySelector('input[name=companyPhone]').value = settings.phone;
	document.querySelector('input[name=companyUrl]').value = settings.website;
}

function saveLoggedUser(user) {
	localStorage.setItem("user", JSON.stringify(user));
}

async function importTemplate(template) {
	fetch(`../server/templates/${template}.html`)
		.then(response => response.text())
		.then(data => {
			document.getElementById('pagePreview').innerHTML = data;
		})
		.catch(error => console.error('Greska pri ucitavanju:', error));
}

// Referenca na input polje i dropdown kontejner
const searchInput = document.getElementById('searchInput');
const dropdownList = document.getElementById('dropdownList');

let activeIndex = -1; // Trenutni aktivni indeks za navigaciju kroz dropdown listu
let dropdownItems = []; // Elementi dropdown liste sa kompletnim podacima

let selectedItem = {}; // Objekat za skladištenje izabranog rezultata

// Event listener za promenu u input polju
searchInput.addEventListener('input', async () => {
	const query = searchInput.value.trim();

	// Sakrij dropdown ako nema teksta za pretragu
	if (query.length === 0) {
		dropdownList.innerHTML = '';
		dropdownList.style.display = 'none';
		return;
	}

	try {
		// Slanje GET zahteva PHP backendu za pretragu
		const response = await fetch(`http://simaks/api/search.php?q=${encodeURIComponent(query)}`);
		const results = await response.json();

		// Prikazivanje rezultata u dropdown listi
		if (results.length > 0) {
			dropdownList.innerHTML = '';
			dropdownItems = results; // Skladištimo sve rezultate

			results.forEach((result, index) => {
				const item = document.createElement('div');
				item.classList.add('dropdown-item');
				item.textContent = `${result.code} - ${result.name} - ${result.model} - ${result.price}`;
				item.setAttribute('data-index', index); // Postavljanje indeksa

				// Dodavanje event listenera za klik na stavku
				item.addEventListener('click', () => {
					selectResult(result);
				});

				// Dodavanje event listenera za `mouseenter` (kada miš pređe preko stavke)
				item.addEventListener('mouseenter', () => {
					activeIndex = index;
					highlightItem(); // Osvetljava stavku mišem
				});

				dropdownList.appendChild(item);
			});
			dropdownList.style.display = 'block';
			activeIndex = -1; // Resetuj aktivni indeks
		} else {
			dropdownList.innerHTML = '<div class="dropdown-item">Nema rezultata</div>';
			dropdownList.style.display = 'block';
			dropdownItems = [];
		}
	} catch (error) {
		console.error('Error fetching search results:', error);
	}
});

// Event listener za gubljenje fokusa sa input polja
searchInput.addEventListener('blur', () => {
	// Koristimo timeout kako bismo omogućili klik na dropdown pre zatvaranja
	setTimeout(() => {
		dropdownList.style.display = 'none';
	}, 200);
});

// Event listener za navigaciju kroz dropdown listu sa tastaturom
searchInput.addEventListener('keydown', (event) => {
	if (dropdownItems.length === 0) {
		return; // Nema stavki u dropdown listi, ništa za navigaciju
	}

	switch (event.key) {
		case 'ArrowDown':
			// Navigacija ka dole
			event.preventDefault();
			if (activeIndex < dropdownItems.length - 1) {
				activeIndex++;
				highlightItem();
			}
			break;
		case 'ArrowUp':
			// Navigacija ka gore
			event.preventDefault();
			if (activeIndex > 0) {
				activeIndex--;
				highlightItem();
			}
			break;
		case 'Enter':
			// Izbor trenutne stavke
			event.preventDefault();
			if (activeIndex >= 0 && activeIndex < dropdownItems.length) {
				const selectedResult = dropdownItems[ activeIndex ];
				selectResult(selectedResult);
			}
			break;
		default:
			break;
	}
});

// Funkcija za označavanje trenutne stavke u dropdown listi
function highlightItem() {
	dropdownItems.forEach((_, index) => {
		if (index === activeIndex) {
			dropdownList.children[ index ].classList.add('highlight');
			dropdownList.children[ index ].scrollIntoView({ block: 'nearest' });
		} else {
			dropdownList.children[ index ].classList.remove('highlight');
		}
	});
}

// Funkcija za izbor rezultata iz dropdown liste
function selectResult(result) {
	// Popunite globalni objekat sa izabranim podacima
	selectedItem = {
		id: result.id,
		code: result.code,
		type: result.type,
		manufacturer: result.manufacturer,
		name: result.name,
		model: result.model,
		img_url: result.img_url,
		description: result.description,
		items: result.items,
		unit: result.unit,
		price: parseFloat(result.price).toFixed(2)
	};

	// Prikazivanje izabranog proizvoda u input polju
	searchInput.value = ``;

	// Sakrij dropdown listu
	dropdownList.style.display = 'none';

	// Pozivanje funkcije za prikaz na frontendu
	displaySelectedItem(selectedItem);
}

function displaySelectedItem(selectedItem) {
	// Referenca na telo tabele
	const tableBody = document.querySelector('#ponudaRow tbody');
	if (!tableBody) {
		console.error("Element 'ponudaRow tbody' nije pronađen.");
		return;
	}

	// Kreiranje novog reda (tr)
	const row = document.createElement('tr');

	// 1. Redni broj (baziran na broju trenutnih redova u tabeli)
	const rowIndex = tableBody.rows.length + 1;
	const tdIndex = document.createElement('td');
	tdIndex.textContent = rowIndex; // Redni broj (od 1 pa naviše)
	tdIndex.style.textAlign = 'center';
	row.appendChild(tdIndex);

	// 2. Šifra proizvoda (code)
	const tdCode = document.createElement('td');
	tdCode.textContent = selectedItem.code;
	tdCode.style.textAlign = 'center';
	row.appendChild(tdCode);

	// 3. Naziv koji kombinuje proizvođača, ime i model
	const combinedString = `${selectedItem.manufacturer} ${selectedItem.name} ${selectedItem.model}`;
	const tdCombined = document.createElement('td');
	tdCombined.textContent = combinedString;
	tdCombined.style.textAlign = 'center';
	row.appendChild(tdCombined);

	// 4. Cena (price)
	const tdPrice = document.createElement('td');
	tdPrice.textContent = formatNumber(parseFormattedNumber(selectedItem.price));
	tdPrice.style.textAlign = 'center';
	row.appendChild(tdPrice);

	// 5. Ostale ćelije ostaju prazne
	for (let i = 0; i < 6; i++) {
		const tdEmpty = document.createElement('td');
		tdEmpty.textContent = ''; // Prazan sadržaj
		tdEmpty.style.textAlign = 'center';
		row.appendChild(tdEmpty);
	}

	// Dodavanje novog reda na kraj tbody-a
	tableBody.appendChild(row);
}

function formatNumber(number) {
	// Proverite da li je prosleđeni broj validan
	if (typeof number !== 'number' || isNaN(number)) {
		throw new Error('Ulaz mora biti validan broj');
	}

	return number
		.toFixed(2) // Zadržavamo dve decimale
		.replace('.', ',') // Menjamo decimalnu tačku zarezom
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Dodajemo tačku kao separator hiljada
}

function parseFormattedNumber(formattedNumber) {
	// Uklanjanje tački koje se koriste kao separator hiljada i zamena zareza tačkom
	return parseFloat(formattedNumber.replace(/\.(?=.*,)/g, '').replace(',', '.'));
}