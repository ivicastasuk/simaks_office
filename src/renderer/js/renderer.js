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

	const el = document.getElementById('btn-sort');
	el.addEventListener('click', () => {
		if (el.classList.contains('desc')) {
			window.electronAPI.fetchData('products', '*', 'ORDER BY code ASC');
			el.classList.remove('desc');
			el.classList.add('asc');
		} else {
			window.electronAPI.fetchData('products', '*', 'ORDER BY code DESC');
			el.classList.remove('asc');
			el.classList.add('desc');
		}
	});
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
		// Slanje zahteva za login na server
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
			(async () => {
				try {
					await fetchAndSaveSettings(result.user.company_id);
					displayCompanySettings();
					await importTemplate('ponuda');
					fillUserData();
					await setPotentialOfferNumber();
				} catch (error) {
					console.error('An error occurred:', error);
				}
			})();
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

// Osluskivanje 'settings-fetched' dogadjaja
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
	window.electronAPI.fetchData('products', '*', 'ORDER BY code DESC');
});

// Slanje zahteva za preuzimanje podataka o klijentima iz baze
document.getElementById('fetchClients').addEventListener('click', () => {
	window.electronAPI.fetchClients('clients');
});

// Primanje podataka iz baze
window.electronAPI.onDataFetched((data) => {
	// Kreiranje tela tabele
	const tbody = document.getElementById("product-list");
	tbody.innerHTML = '';

	data.forEach(row => {
		const tr = document.createElement('tr');
		tr.className = 'hover';

		// Kreiranje i dodavanje ćelija za sifru
		const tdCode = document.createElement('td');
		tdCode.textContent = row.code;
		tdCode.setAttribute('data', row.id);
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
		tdPrice.textContent = formatNumber(row.price);
		tdPrice.setAttribute('class', 'text-right');
		tr.appendChild(tdPrice);

		// Kreiranje dugmeta za brisanje
		const tdActions = document.createElement('td');
		tdActions.style.display = "flex";
		tdActions.style.flexDirection = "column";
		tdActions.style.justifyContent = "center";
		tdActions.style.alignItems = "flex-start";
		tdActions.style.gap = "4px";
		const deleteButton = document.createElement('button');
		deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FF0000" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
		deleteButton.addEventListener('click', () => {
			// Pozivanje funkcije za brisanje
			deleteRow('products', row.id);
		});
		tdActions.appendChild(deleteButton);

		// Kreiranje dugmeta za editovanje
		const editButton = document.createElement('button');
		editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1C71A1" d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13l.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71l-5.3 5.3V21h2.12l5.3-5.3z"/></svg>';
		editButton.addEventListener('click', () => {
			populateFormWithProduct(row); // Funkcija za popunjavanje forme
		});
		tdActions.appendChild(editButton);

		tr.appendChild(tdActions);

		// Dodavanje reda u telo tabele
		tbody.appendChild(tr);
	});
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

		// Brisanje klijenta iz baze
		const tdActions = document.createElement('td');
		const deleteButton = document.createElement('button');
		deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#FF0000" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
		deleteButton.addEventListener('click', () => {
			// Pozivanje funkcije za brisanje
			deleteRow('clients', row.id);
		});
		tdActions.appendChild(deleteButton);
		tr.appendChild(tdActions);

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
		const code = document.querySelector("input[name=code]").value.trim();
		const type = document.querySelector("select[name=type]").value;
		const manufacturer = document.querySelector("input[name=manufacturer]").value.trim();
		const name = document.querySelector("input[name=name]").value.trim();
		const model = document.querySelector("input[name=model]").value.trim();
		const image = window.uploadedImageName || "dummy.jpg";
		const description = document.querySelector("textarea[name=description]").value.trim();
		const unit = document.querySelector("select[name=units]").value;
		const price = document.querySelector("input[name=price]").value.trim();

		// Validacija obaveznih polja
		if (!code || !model) {
			Swal.fire({
				title: 'Greška',
				text: 'Polja ŠIFRA i OZNAKA su obavezni...',
				icon: 'error',
				confirmButtonText: 'OK'
			});
			return;
		}

		try {
			// Provera da li artikal već postoji
			const duplicateResult = await checkForDuplicateProduct(code, model);

			if (duplicateResult.codeExists && duplicateResult.modelExists) {
				Swal.fire({
					title: 'Greška',
					text: 'Artikal sa unetom šifrom i oznakom već postoji u bazi.',
					icon: 'error',
					confirmButtonText: 'OK'
				});
				return;
			} else if (duplicateResult.codeExists) {
				Swal.fire({
					title: 'Greška',
					text: 'Artikal sa unetom šifrom već postoji u bazi.',
					icon: 'error',
					confirmButtonText: 'OK'
				});
				return;
			} else if (duplicateResult.modelExists) {
				Swal.fire({
					title: 'Greška',
					text: 'Artikal sa unetom oznakom već postoji u bazi.',
					icon: 'error',
					confirmButtonText: 'OK'
				});
				return;
			}

			// Ako artikal ne postoji, nastavljamo sa unosom
			const data = {
				id: null,
				code: code,
				type: type,
				manufacturer: manufacturer,
				name: name,
				model: model,
				img_url: image,
				description: description,
				unit: unit,
				price: price
			};

			const result = await window.electronAPI.insertData('products', data);
			const swalResult = await Swal.fire({
				title: 'Uspeh',
				text: 'Proizvod je uspešno dodan u bazu!',
				icon: 'success',
				confirmButtonText: 'OK'
			});
			if (swalResult.isConfirmed) {
				await window.electronAPI.fetchData('products', '*', 'ORDER BY code DESC');
				resetProductInputs();
				setTimeout(() => {
					const codeInput = document.querySelector('[name=code]');
					if (codeInput) {
						codeInput.focus();
					} else {
						console.log('Ne postoji input polje za sifru!');
					}
				}, 0);
			}
		} catch (error) {
			console.error('Error checking for duplicate:', error);
			Swal.fire({
				title: 'Greška',
				text: 'Došlo je do greške prilikom provere duplikata.',
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
			}).then(() => {
				window.electronAPI.fetchClients('clients');
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

// Brisanje podataka iz baze
function deleteRow(tableName, id) {
	// Prikazivanje potvrde pre brisanja
	Swal.fire({
		title: 'Da li ste sigurni?',
		text: 'Ova akcija je nepovratna!',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Da, obriši!',
		cancelButtonText: 'Ne, odustani'
	}).then((result) => {
		if (result.isConfirmed) {
			// Slanje zahteva za brisanje
			window.electronAPI.deleteData(tableName, 'id = ?', [ id ]);

			// Slušanje na odgovor o uspešnom brisanju
			window.electronAPI.onDataDeleted((response) => {
				Swal.fire({
					title: 'Obrisano!',
					text: 'Red je uspešno obrisan.',
					icon: 'success',
					confirmButtonText: 'OK'
				}).then(() => {
					// Ponovno učitavanje podataka nakon brisanja
					if (tableName === 'products') {
						window.electronAPI.fetchData('products', '*', 'ORDER BY code DESC');
					} else if (tableName === 'clients') {
						window.electronAPI.fetchClients('clients');
					}
				});
			});
		}
	});
}

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

// Funkcija za rukovanje slikom
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
			// Azuriranje previewa za sliku
			document.getElementById('imagePreview').src = URL.createObjectURL(file);
			return result.filename;
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

// Event listener za izbor slike u input polju
document.getElementById('imgInput').addEventListener('change', async function (event) {
	const file = event.target.files[ 0 ];
	if (!file) {
		return;
	}

	// Validacija tipa fajla
	const validTypes = [ 'image/jpeg', 'image/png' ];
	if (!validTypes.includes(file.type)) {
		Swal.fire({
			title: 'Greška',
			text: 'Neispravan tip fajla. Molimo izaberite JPEG ili PNG sliku.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		event.target.value = ''; // Resetujemo input
		return;
	}

	// Validacija veličine fajla (1MB = 1048576 bajtova)
	if (file.size > 1048576) {
		Swal.fire({
			title: 'Greška',
			text: 'Veličina fajla prelazi 1MB. Molimo izaberite manji fajl.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		event.target.value = ''; // Resetujemo input
		return;
	}

	// Validacija dimenzija slike
	const img = new Image();
	img.onload = async function () {
		if (img.width > 1024 || img.height > 1024) {
			Swal.fire({
				title: 'Greška',
				text: 'Dimenzije slike prelaze 1024x1024 piksela. Molimo izaberite manju sliku.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			event.target.value = ''; // Resetujemo input
			return;
		}

		// Ako su sve validacije prošle, nastavljamo sa uploadom slike
		const imageName = await uploadImage(file);

		if (imageName) {
			// Skladištenje naziva slike za kasniju upotrebu
			window.uploadedImageName = imageName;
		}
	};
	img.onerror = function () {
		Swal.fire({
			title: 'Greška',
			text: 'Neispravan fajl slike.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
		event.target.value = ''; // Resetujemo input
	};

	// Čitamo fajl kao Data URL da bismo mogli da učitamo sliku
	const reader = new FileReader();
	reader.onload = function (e) {
		img.src = e.target.result;
	};
	reader.readAsDataURL(file);
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
	try {
		const response = await fetch(`../server/templates/${template}.html`);
		const data = await response.text();
		document.getElementById('pagePreview').innerHTML = data;
		await dataFill();
	} catch (error) {
		console.error('Greska pri ucitavanju:', error);
	}
}

createDropdownSearch('searchInput', 'dropdownList', 'products', [ 'code', 'name', 'model', 'price' ]);
createDropdownSearch('clientSelect', 'dropdownClients', 'clients', [ 'name', 'city', 'pib' ]);

// Funkcija za povlacenje podataka i pravljenje dropdown liste
async function createDropdownSearch(inputId, dropdownId, tableName, displayColumns) {
	const searchInput = document.getElementById(inputId);
	const dropdownList = document.getElementById(dropdownId);

	let activeIndex = -1;
	let dropdownItems = [];

	searchInput.addEventListener('input', async () => {
		const query = searchInput.value.trim();

		// Sakrij dropdown ako nema upita
		if (query.length === 0) {
			dropdownList.innerHTML = '';
			dropdownList.style.display = 'none';
			return;
		}

		try {
			// Slanje upita API-ju
			const response = await fetch(`http://simaks/api/search.php?q=${encodeURIComponent(query)}&table=${tableName}`);
			const results = await response.json();

			// Prikazivanje sadrzaja u dropdown listi
			if (results.length > 0) {
				dropdownList.innerHTML = '';
				dropdownItems = results;

				results.forEach((result, index) => {
					const item = document.createElement('div');
					item.classList.add('dropdown-item');

					// Dinamicko kreiranje sadrzaja za dropdown listu
					item.textContent = displayColumns.map(col => result[ col ]).join(' - ');
					item.setAttribute('data-index', index);

					// Event listener za klik misem na oznacenu stavku
					item.addEventListener('click', () => {
						selectResult(result, searchInput, dropdownId, tableName);
					});

					// Event listener za ulazak misa u oznacenu stavku
					item.addEventListener('mouseenter', () => {
						activeIndex = index;
						highlightItem(dropdownList, activeIndex);
					});

					dropdownList.appendChild(item);
				});
				dropdownList.style.display = 'block';
				activeIndex = -1; // Resetuj aktivni index
			} else {
				dropdownList.innerHTML = '<div class="dropdown-item">Nema rezultata</div>';
				dropdownList.style.display = 'block';
				dropdownItems = [];
			}
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	});

	// Event listener za gubljenje fokusa na input polju
	searchInput.addEventListener('blur', () => {
		setTimeout(() => {
			dropdownList.style.display = 'none';
		}, 200);
	});

	// Event listener za navigaciju preko tastature
	searchInput.addEventListener('keydown', (event) => {
		if (dropdownItems.length === 0) {
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (activeIndex < dropdownItems.length - 1) {
					activeIndex++;
					highlightItem(dropdownList, activeIndex);
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (activeIndex > 0) {
					activeIndex--;
					highlightItem(dropdownList, activeIndex);
				}
				break;
			case 'Enter':
				event.preventDefault();
				if (activeIndex >= 0 && activeIndex < dropdownItems.length) {
					const selectedResult = dropdownItems[ activeIndex ];
					selectResult(selectedResult, searchInput, dropdownId, tableName);
				}
				break;
			default:
				break;
		}
	});
}

createArticlesDropdownSearch('manufacturer', 'dropdownManufacturer', 'products', 'manufacturer');
createArticlesDropdownSearch('name', 'dropdownName', 'products', 'name');
createArticlesDropdownSearch('model', 'dropdownModel', 'products', 'model');

// Funkcija za kreiranje dropdown pretrage za artikle
async function createArticlesDropdownSearch(inputId, dropdownId, tableName, displayColumn) {
    const searchInput = document.getElementById(inputId);
    const dropdownList = document.getElementById(dropdownId);

    let activeIndex = -1;
    let dropdownItems = [];

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();

        // Sakrij dropdown ako nema upita
        if (query.length === 0) {
            dropdownList.innerHTML = '';
            dropdownList.style.display = 'none';
            return;
        }

        try {
            // Slanje upita API-ju
            const response = await fetch(`http://simaks/api/search.php?q=${encodeURIComponent(query)}&table=${tableName}`);
            let results = await response.json();

            // Filtriranje rezultata za jednu kolonu i uklanjanje duplikata
            const uniqueValues = new Map();

            results.forEach(result => {
                // Dobijanje vrednosti iz specificirane kolone, neosetljivo na velika i mala slova
                const value = result[displayColumn];

                // Ako vrednost nije već u mapi, dodaj je
                if (value && !uniqueValues.has(value.toLowerCase())) {
                    uniqueValues.set(value.toLowerCase(), result);
                }
            });

            // Konverzija mape u niz rezultata
            const uniqueResults = Array.from(uniqueValues.values());

            // Prikazivanje sadržaja u dropdown listi
            if (uniqueResults.length > 0) {
                dropdownList.innerHTML = '';
                dropdownItems = uniqueResults;

                uniqueResults.forEach((result, index) => {
                    const item = document.createElement('div');
                    item.classList.add('dropdown-item');

                    // Prikaz vrednosti iz specificirane kolone
                    item.textContent = result[displayColumn];
                    item.setAttribute('data-index', index);

                    // Event listener za klik mišem na stavku
                    item.addEventListener('click', () => {
                        selectArticlesResult(result, searchInput, dropdownId, displayColumn);
                    });

                    // Event listener za ulazak miša u stavku
                    item.addEventListener('mouseenter', () => {
                        activeIndex = index;
                        highlightArticlesItem(dropdownList, activeIndex);
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
            console.error('Greška prilikom preuzimanja rezultata pretrage:', error);
        }
    });

    // Event listener za gubljenje fokusa na input polju
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            dropdownList.style.display = 'none';
        }, 200);
    });

    // Event listener za navigaciju preko tastature
    searchInput.addEventListener('keydown', (event) => {
        if (dropdownItems.length === 0) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (activeIndex < dropdownItems.length - 1) {
                    activeIndex++;
                    highlightArticlesItem(dropdownList, activeIndex);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (activeIndex > 0) {
                    activeIndex--;
                    highlightArticlesItem(dropdownList, activeIndex);
                }
                break;
            case 'Enter':
                event.preventDefault();
                if (activeIndex >= 0 && activeIndex < dropdownItems.length) {
                    const selectedResult = dropdownItems[activeIndex];
                    selectArticlesResult(selectedResult, searchInput, dropdownId, displayColumn);
                }
                break;
            default:
                break;
        }
    });
}

// Funkcija za označavanje izabrane stavke u artiklima
function highlightArticlesItem(dropdownList, activeIndex) {
    Array.from(dropdownList.children).forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('highlight');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('highlight');
        }
    });
}

// Funkcija za selektovanje izbora u dropdownu u artiklima
function selectArticlesResult(result, searchInput, dropdownId, displayColumn) {
    const dropdownList = document.getElementById(dropdownId);

    // Postavi vrednost input polja na vrednost izabrane kolone
    searchInput.value = result[displayColumn];

    // Sakrij dropdown listu
    dropdownList.style.display = 'none';

    // Opcionalno: ovde možete pozvati funkciju koja dalje obrađuje izabrani rezultat
    // displaySelectedArticlesItem(result);
}

// Funkcija za oznacavanje izabrane stavke
function highlightItem(dropdownList, activeIndex) {
	Array.from(dropdownList.children).forEach((item, index) => {
		if (index === activeIndex) {
			item.classList.add('highlight');
			item.scrollIntoView({ block: 'nearest' });
		} else {
			item.classList.remove('highlight');
		}
	});
}

// Funkcija za selektovanje izbora u dropdownu
function selectResult(result, searchInput, dropdownId, tableName) {
	const dropdownList = document.getElementById(dropdownId);

	// Postavi vrednost input polja na osnovu tabela
	if (tableName === 'products') {
		searchInput.value = '';
	} else if (tableName === 'clients') {
		searchInput.value = `${result.name} - ${result.city} - ${result.pib}`;
	}

	// Sakrij dropdown listu
	dropdownList.style.display = 'none';

	// Pozovi odgovarajuću funkciju za prikaz na frontendu na osnovu tabele
	displaySelectedItem(result, tableName);
}

// Funkcija za prikazivanje selektovanog artikla - ubacivanje u templejt ponude
async function displaySelectedItem(selectedItem, tableName) {
	// const displayContainer = document.getElementById('searchResult');
	// if (!displayContainer) {
	// 	console.error("Element 'searchResult' nije pronađen.");
	// 	return;
	// }

	if (tableName === 'products') {
		// Prikaz za tabelu 'products'
		const tableBody = document.querySelector('#ponudaRow tbody');
		if (!tableBody) {
			console.error("Element 'ponudaRow tbody' nije pronađen.");
			return;
		}

		// Provera da li artikal već postoji u tabeli (po šifri proizvoda)
		const existingRow = Array.from(tableBody.rows).find(row => row.cells[ 1 ] && row.cells[ 1 ].textContent === selectedItem.code);
		if (existingRow) {
			console.warn('Artikal sa šifrom', selectedItem.code, 'već postoji u tabeli.');
			Swal.fire({
				title: 'Upozorenje',
				text: 'Artikal sa šifrom ' + selectedItem.code + ' već postoji u tabeli.',
				icon: 'warning',
				confirmButtonText: 'OK'
			});
			return;
		}

		// Kreiranje novog reda (tr)
		const row = document.createElement('tr');
		row.style.position = 'relative';

		// 1. Redni broj (baziran na broju trenutnih redova u tabeli)
		const rowIndex = tableBody.rows.length + 1;
		const tdIndex = document.createElement('td');
		const tdIndexDiv = document.createElement('div');
		tdIndexDiv.style.textAlign = 'center';
		tdIndexDiv.style.display = 'flex';
		tdIndexDiv.style.flexDirection = 'column';
		tdIndexDiv.style.justifyContent = 'center';
		tdIndexDiv.style.alignItems = 'center';
		// Dodavanje rednog broja
		const indexP = document.createElement('p');
		indexP.textContent = rowIndex; // Redni broj (od 1 pa naviše)
		tdIndexDiv.appendChild(indexP);
		// Dodavanje ikonice za brisanje reda
		const btnDelete = document.createElement('button');
		btnDelete.classList.add("btnDelete");
		btnDelete.classList.add(`btn-${rowIndex}`);
		btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#FF0000" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';

		// Dodavanje funkcionalnosti za brisanje
		btnDelete.addEventListener('click', () => {
			row.remove(); // Brisanje trenutnog reda
			renumberRows(); // Poziv funkcije za ponovno numerisanje
			calculateItems();
			calculateSumm();
		});

		tdIndexDiv.appendChild(btnDelete);
		tdIndex.appendChild(tdIndexDiv);
		row.appendChild(tdIndex);

		// 2. Šifra proizvoda (code)
		const tdCode = document.createElement('td');
		tdCode.textContent = selectedItem.code;
		tdCode.style.textAlign = 'center';
		row.appendChild(tdCode);

		// 3. Naziv koji kombinuje proizvođača, ime i model, sa tabelom unutar ćelije
		const tdCombined = document.createElement('td');
		tdCombined.style.textAlign = 'left';

		// Kreiranje nove tabele unutar ćelije tdCombined
		const tableInsideTd = document.createElement('table');

		// Stilizacija interne tabele da se uklopi unutar ćelije
		tableInsideTd.style.width = '100%';
		tableInsideTd.classList.add("secondary-table");
		tableInsideTd.style.fontSize = '7pt';

		// Kreiranje prvog reda tabele za sliku i naziv proizvoda
		const row1 = document.createElement('tr');

		// Druga ćelija prvog reda - kombinovani naziv proizvoda (proizvođač, naziv, model)
		const cellCombinedName = document.createElement('td');
		cellCombinedName.style.textAlign = 'left';
		const combinedString = `${selectedItem.manufacturer} ${selectedItem.name} ${selectedItem.model}`;
		cellCombinedName.textContent = combinedString;
		cellCombinedName.style.fontWeight = "600";
		cellCombinedName.style.textTransform = "uppercase";
		row1.appendChild(cellCombinedName);
		if (document.getElementById('checkImage').checked == true) {
			// Prva ćelija prvog reda - za sliku proizvoda
			const cellImage = document.createElement('td');
			cellImage.style.textAlign = 'center'; // Središnji poravnavanje slike
			cellImage.style.width = '32px'; // Opcionalno, možeš postaviti širinu za ćeliju
			const productImage = document.createElement('img');
			productImage.src = `http://simaks/img/products/${selectedItem.img_url}`; // Postavi URL slike proizvoda
			productImage.alt = `${selectedItem.manufacturer} ${selectedItem.name} ${selectedItem.model}`;
			productImage.style.maxWidth = '32px'; // Ograničenje maksimalne širine
			productImage.style.height = 'auto'; // Održavanje proporcija slike
			cellImage.appendChild(productImage);
			row1.appendChild(cellImage);
		}

		// Dodavanje prvog reda u internu tabelu
		tableInsideTd.appendChild(row1);

		// Kreiranje drugog reda tabele za opis proizvoda
		const row2 = document.createElement('tr');

		// Druga ćelija drugog reda - opis proizvoda
		const cellDescription = document.createElement('td');
		if (document.getElementById('checkImage').checked == true) {
			cellDescription.colSpan = 2;
		}
		cellDescription.style.textAlign = 'left';
		cellDescription.textContent = selectedItem.description; // Postavi opis proizvoda
		row2.appendChild(cellDescription);

		// Dodavanje drugog reda u internu tabelu
		tableInsideTd.appendChild(row2);

		// Dodavanje kreirane tabele u kombinovanu ćeliju
		tdCombined.appendChild(tableInsideTd);

		// Dodavanje kombinovane ćelije u red glavne tabele
		row.appendChild(tdCombined);

		// 4. Jedinica mere
		const tdJM = document.createElement('td');
		tdJM.textContent = selectedItem.unit;
		tdJM.style.textAlign = 'center';
		row.appendChild(tdJM);

		// 5. Kolicina
		const tdKolicina = document.createElement('td');
		tdKolicina.setAttribute('contenteditable', 'true');
		tdKolicina.style.textAlign = 'center';
		tdKolicina.setAttribute('cellName', `kolicina`);
		tdKolicina.textContent = '1';
		row.appendChild(tdKolicina);

		// 6. Cena (price)
		const tdPrice = document.createElement('td');
		tdPrice.textContent = formatNumber(parseFormattedNumber(selectedItem.price));
		tdPrice.setAttribute('contenteditable', 'true');
		tdPrice.style.textAlign = 'center';
		tdPrice.setAttribute('cellName', `cena`);
		row.appendChild(tdPrice);

		// 7. Rabat
		const tdRabat = document.createElement('td');
		tdRabat.setAttribute('contenteditable', 'true');
		tdRabat.style.textAlign = 'center';
		tdRabat.setAttribute('cellName', `rabat`);
		tdRabat.textContent = '0';
		row.appendChild(tdRabat);

		// 8. Cena sa rabatom
		const tdCenaRabat = document.createElement('td');
		tdCenaRabat.style.textAlign = 'center';
		tdCenaRabat.setAttribute('cellName', `cenarabat`);
		row.appendChild(tdCenaRabat);

		// 9. Iznos
		const tdIznos = document.createElement('td');
		tdIznos.style.textAlign = 'center';
		tdIznos.setAttribute('cellName', `iznos`);
		row.appendChild(tdIznos);

		// 10. PDV %
		const tdPdv = document.createElement('td');
		tdPdv.setAttribute('contenteditable', 'true');
		tdPdv.style.textAlign = 'center';
		tdPdv.setAttribute('cellName', `pdv`);
		tdPdv.textContent = '20';
		row.appendChild(tdPdv);

		// 11. Iznos PDV-a
		const tdIznosPdv = document.createElement('td');
		const iznos = parseFormattedNumber(selectedItem.price);
		const iznosPdv = iznos * (20 / 100);
		tdIznosPdv.textContent = iznosPdv.toFixed(2);
		tdIznosPdv.style.textAlign = 'center';
		tdIznosPdv.setAttribute('cellName', `iznospdv`);
		row.appendChild(tdIznosPdv);

		// 12. Ukupno
		const tdUkupno = document.createElement('td');
		tdUkupno.textContent = '';
		tdUkupno.style.textAlign = 'center';
		tdUkupno.setAttribute('cellName', `ukupno`);
		row.appendChild(tdUkupno);

		// Dodavanje novog reda na kraj tbody-a
		tableBody.appendChild(row);


		await calculateItems();
		await calculateSumm();
		await addListeners();

	} else if (tableName === 'clients') {
		// Prikaz za tabelu 'clients'
		document.getElementById('nazivKupca').textContent = selectedItem.name;
		document.getElementById('adresaKupca').textContent = selectedItem.address;
		document.getElementById('mestoKupca').textContent = selectedItem.city;
		document.getElementById('pibKupca').textContent = selectedItem.pib;
		document.getElementById('mbKupca').textContent = selectedItem.mb;

	}
}

async function addListeners() {
	return new Promise((resolve) => {
		// Event listeneri na sve editabilne celije u ponudi
		const editableCells = document.querySelectorAll('#ponudaRow tbody td[contenteditable="true"]');

		editableCells.forEach(cell => {
			// Uklanjanje prethodnih slušalaca
			cell.removeEventListener('input', () => { });

			// Dodavanje 'input' događaja na svaki <td>
			cell.addEventListener('input', () => {
				calculateItems();
				calculateSumm();
			});
		});

		// Oznaka da je funkcija završena
		resolve();
	});
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
	// Proveravamo da li je ulaz već broj, i ako jeste, vraćamo ga
	if (typeof formattedNumber === 'number') {
		return formattedNumber;
	}

	// Proveravamo da li je ulaz string, u suprotnom ga konvertujemo
	if (typeof formattedNumber !== 'string') {
		formattedNumber = formattedNumber.toString();
	}

	// Uklanjanje tački koje se koriste kao separator hiljada i zamena zareza tačkom
	return parseFloat(formattedNumber.replace(/\.(?=.*,)/g, '').replace(',', '.'));
}

async function calculateItems() {
	return new Promise((resolve) => {
		// Selektujemo sve redove tabele
		const rows = document.querySelectorAll('#ponudaRow tbody > tr');

		rows.forEach(row => {
			// Pronalaženje svih ćelija u trenutnom redu
			const kolicinaCell = row.querySelector('[cellName="kolicina"]');
			const cenaCell = row.querySelector('[cellName="cena"]');
			const rabatCell = row.querySelector('[cellName="rabat"]');
			const cenaRabatCell = row.querySelector('[cellName="cenarabat"]');
			const iznosCell = row.querySelector('[cellName="iznos"]');
			const pdvCell = row.querySelector('[cellName="pdv"]');
			const cenaPdvCell = row.querySelector('[cellName="iznospdv"]');
			const ukupnoCell = row.querySelector('[cellName="ukupno"]');

			// Parsiranje vrednosti iz ćelija			
			const kolicina = parseFloat(kolicinaCell.innerText) || 0;
			const cena = parseFloat(parseFormattedNumber(cenaCell.innerText)) || 0;
			const rabat = parseInt(rabatCell.innerText) || 0;
			const pdv = parseInt(pdvCell.innerText) || 0;

			// Izračunavanje cene sa rabatom
			const cenaSaRabatom = cena * (1 - rabat / 100);
			cenaRabatCell.innerText = formatNumber(cenaSaRabatom);

			// Izračunavanje iznosa (količina * cena sa rabatom)
			const iznos = kolicina * cenaSaRabatom;
			iznosCell.innerText = formatNumber(iznos);

			// Izračunavanje PDV-a (procenta od iznosa)
			const iznosPdv = iznos * (pdv / 100);
			cenaPdvCell.innerText = formatNumber(iznosPdv);

			// Izračunavanje ukupne cene (iznos + PDV)
			const ukupno = iznos + iznosPdv;
			ukupnoCell.innerText = formatNumber(ukupno);
		});

		resolve();
	});
}

async function calculateSumm() {

	return new Promise((resolve) => {
		// Izracunavanje sume za iznos kolonu
		const colIznos = document.querySelectorAll('[cellName="iznos"]');

		let sumaIznos = 0;
		colIznos.forEach(item => {
			sumaIznos += parseFloat(parseFormattedNumber(item.innerText));
		});
		document.getElementById('sumaIznos').textContent = formatNumber(sumaIznos);

		// Izracunavanje sume za iznos pdv-a kolonu
		const colIznosPdv = document.querySelectorAll('[cellName="iznospdv"]');

		let sumaIznosPdv = 0;
		colIznosPdv.forEach(item => {
			sumaIznosPdv += parseFloat(parseFormattedNumber(item.innerText));
		});
		document.getElementById('sumaPDV').textContent = formatNumber(sumaIznosPdv);

		// Izracunavanje sume za ukupan iznos
		const colUkupno = document.querySelectorAll('[cellName="ukupno"]');

		let sumaUkupno = 0;
		colUkupno.forEach(item => {
			sumaUkupno += parseFloat(parseFormattedNumber(item.innerText));
		});
		document.getElementById('sumaUkupno').textContent = formatNumber(sumaUkupno);

		// Izracunavanje ukupne sume bez rabata i pdv-a
		const finalUkupno = document.getElementById('finalUkupno');
		const rows = document.querySelectorAll('#ponudaRow tbody > tr');
		let kolicina = 0;
		let cena = 0;
		let sumaFinal = 0;
		rows.forEach(row => {
			kolicina = row.querySelector('[cellName="kolicina"]').innerText;
			cena = row.querySelector('[cellName="cena"]').innerText;
			sumaFinal += parseFloat(parseFormattedNumber(kolicina)) * parseFloat(parseFormattedNumber(cena));
		});
		finalUkupno.textContent = formatNumber(sumaFinal);

		// Izracunavanje iznosa ukupnog rabata
		const finalRabat = document.getElementById('finalRabat');
		finalRabat.textContent = formatNumber(sumaFinal - sumaIznos);

		// Ispisivanje iznosa
		document.getElementById('finalIznos').textContent = formatNumber(sumaIznos);

		// Ispisivanje PDV-a
		document.getElementById('finalPDV').textContent = formatNumber(sumaIznosPdv);

		// Ispisivanje ukupnog iznosa za placanje
		document.getElementById('finalPlacanje').textContent = formatNumber(sumaUkupno);

		resolve();
	});
}

function dataFill() {
	const companyData = JSON.parse(localStorage.getItem("settings"));
	document.getElementById('companyName').textContent = companyData.company;
	document.getElementById('companyAddress').textContent = companyData.address;
	document.getElementById('companyCity').textContent = companyData.city;
	document.getElementById('companyPIB').textContent = companyData.pib;
	document.getElementById('companyMB').textContent = companyData.mb;

	// Formatiranje i prikazivanje datuma
	const danasnjiDatum = new Date();
	const dan = String(danasnjiDatum.getDate()).padStart(2, '0');
	const mesec = String(danasnjiDatum.getMonth() + 1).padStart(2, '0');
	const godina = danasnjiDatum.getFullYear();
	const formatiraniDatum = `${dan}.${mesec}.${godina}`;
	document.getElementById('datum').textContent = formatiraniDatum;
}

async function fillUserData() {
	const userData = JSON.parse(localStorage.getItem('user'));
	const companyData = JSON.parse(localStorage.getItem('settings'));

	document.getElementById('userName').textContent = `${userData.first_name} ${userData.last_name}`;
	document.getElementById('userPhone').textContent = userData.phone;
	document.getElementById('userEmail').textContent = userData.email;
	document.getElementById('companyPhone').textContent = companyData.phone;
}


// Dodavanje event listenera za klik na dugme createPdf
document.getElementById('createPdf').addEventListener('click', async () => {
	try {
		// Rezervacija broja ponude
		const reservedOfferData = await window.electronAPI.reserveOfferNumber(window.potentialOfferNumber);

		const yearString = reservedOfferData.godina.toString().slice(-2);
		const offerNumberString = reservedOfferData.broj.toString().padStart(3, '0');

		// Promeni broj ponude (u slucaju da je promenjen)
		document.getElementById('ponudaGodina').textContent = yearString;
		document.getElementById('ponudaBroj').textContent = offerNumberString;

		// Nastavi sa kreiranjem pdf fajla
		const pagePreviewElement = document.getElementById('pagePreview');
		if (!pagePreviewElement) {
			console.error('Element with ID #pagePreview not found.');
			return;
		}

		const pagePreviewHTML = pagePreviewElement.outerHTML;

		// Snimanje podataka ponude u bazu
		await saveOfferData(reservedOfferData);

		// Posalji na bekend da se kreira pdf
		window.electronAPI.createPdf(pagePreviewHTML);

		Swal.fire({
			title: 'Uspeh',
			text: 'Ponuda je uspešno kreirana i PDF je generisan.',
			icon: 'success',
			confirmButtonText: 'OK',
		});

	} catch (error) {
		console.error('Error creating offer:', error);
		Swal.fire({
			title: 'Greška',
			text: 'Došlo je do greške prilikom kreiranja ponude.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
	}
});

// Funkcija za snimanje podataka iz ponude
async function saveOfferData(offerData) {
	// Prikupljanje podataka
	const offerNumber = offerData.broj;
	const offerYear = offerData.godina;
	const clientName = document.getElementById('nazivKupca').textContent || '';
	const clientAddress = document.getElementById('adresaKupca').textContent || '';
	const clientCity = document.getElementById('mestoKupca').textContent || '';
	const clientPIB = document.getElementById('pibKupca').textContent || '';
	const clientMB = document.getElementById('mbKupca').textContent || '';

	const totalAmount = parseFloat(parseFormattedNumber(document.getElementById('finalIznos').textContent));
	const totalVAT = parseFloat(parseFormattedNumber(document.getElementById('finalPDV').textContent));
	const totalWithVAT = parseFloat(parseFormattedNumber(document.getElementById('finalPlacanje').textContent));

	// const notes = document.querySelector('[contenteditable][data-note]').innerText || '';
	// console.log(notes);

	// Pokupi stavke iz ponude
	const items = [];
	const rows = document.querySelectorAll('#ponudaRow tbody > tr');
	rows.forEach(row => {
		const item = {
			code: row.cells[ 1 ].textContent,
			description: row.cells[ 2 ].textContent,
			unit: row.cells[ 3 ].textContent,
			quantity: parseFloat(parseFormattedNumber(row.querySelector('[cellName="kolicina"]').innerText)) || '',
			price: parseFloat(parseFormattedNumber(row.querySelector('[cellName="cena"]').innerText)) || '',
			discount: parseFloat(parseFormattedNumber(row.querySelector('[cellName="rabat"]').innerText)),
			priceWithDiscount: parseFloat(parseFormattedNumber(row.querySelector('[cellName="cenarabat"]').innerText)) || '',
			amount: parseFloat(parseFormattedNumber(row.querySelector('[cellName="iznos"]').innerText)) || '',
			vatPercent: parseFloat(parseFormattedNumber(row.querySelector('[cellName="pdv"]').innerText)) || '',
			vatAmount: parseFloat(parseFormattedNumber(row.querySelector('[cellName="iznospdv"]').innerText)) || '',
			total: parseFloat(parseFormattedNumber(row.querySelector('[cellName="ukupno"]').innerText)) || '',
		};
		items.push(item);
	});

	const data = {
		offerNumber,
		offerYear,
		clientName,
		clientAddress,
		clientCity,
		clientPIB,
		clientMB,
		totalAmount,
		totalVAT,
		totalWithVAT,
		items,
		// Dodati ostale kolone ako je potrebno
	};

	await window.electronAPI.saveOffer(data);
}

// Primanje obaveštenja o kreiranju PDF-a
window.electronAPI.onPdfCreated((event, response) => {
	if (response.success) {
		console.log('PDF je uspešno kreiran:', response.path);
	} else {
		console.error('Greška prilikom kreiranja PDF-a:', response.message);
	}
});

function renumberRows() {
	const tableBody = document.querySelector('#ponudaRow tbody');
	// Selektuj samo tr elemente koji su direktna deca tbody-a, a ne one koji su ugnježdeni
	const rows = tableBody.querySelectorAll(':scope > tr');

	rows.forEach((row, index) => {
		// Selektuj prvu ćeliju u svakom redu koja sadrži redni broj
		const tdIndex = row.querySelector('td:first-child div p');
		if (tdIndex) {
			tdIndex.textContent = index + 1; // Ažuriraj redni broj
		}

		// Ažuriraj klasu dugmeta za brisanje da odgovara novom rednom broju
		const btnDelete = row.querySelector('.btnDelete');
		if (btnDelete) {
			btnDelete.classList.remove(...btnDelete.classList);
			btnDelete.classList.add('btnDelete', `btn-${index + 1}`);
		}
	});
}

document.getElementById("resetForm").addEventListener('click', () => {
	// Resetovanje input polja
	const formInputs = document.querySelectorAll('input, textarea, select');
	formInputs.forEach(input => {
		if (input.type === 'checkbox' || input.type === 'radio') {
			input.checked = false; // Resetuj čekirane inpute
		} else {
			input.value = ''; // Resetuj sve tekstualne inpute, textarea i select
		}
	});

	// Brisanje svih redova iz tabele
	const tableBody = document.querySelector('#ponudaRow tbody');
	while (tableBody.firstChild) {
		tableBody.removeChild(tableBody.firstChild);
	}

	// Resetovanje polja za kupca
	document.getElementById('nazivKupca').textContent = '';
	document.getElementById('adresaKupca').textContent = '';
	document.getElementById('mestoKupca').textContent = '';
	document.getElementById('pibKupca').textContent = '';
	document.getElementById('mbKupca').textContent = '';

	// Resetovanje prikaza sume (ako postoji)
	document.getElementById('sumaIznos').textContent = '0,00';
	document.getElementById('sumaPDV').textContent = '0,00';
	document.getElementById('sumaUkupno').textContent = '0,00';
	document.getElementById('finalUkupno').textContent = '0,00';
	document.getElementById('finalRabat').textContent = '0,00';
	document.getElementById('finalIznos').textContent = '0,00';
	document.getElementById('finalPDV').textContent = '0,00';
	document.getElementById('finalPlacanje').textContent = '0,00';

	dataFill();
	fillUserData();
	setPotentialOfferNumber();

	// Prikaz poruke o uspešnom resetovanju
	Swal.fire({
		title: 'Resetovano!',
		text: 'Formular je uspešno resetovan.',
		icon: 'success',
		confirmButtonText: 'OK'
	});
});

// JavaScript funkcionalnost za pomeranje separatora
const divider = document.getElementById('divider');
const leftPanel = document.getElementById('pagePreview');
const rightPanel = divider.nextElementSibling;

let isDragging = false;

// Funkcija koja se poziva kada korisnik počne da vuče separator
divider.addEventListener('mousedown', function (e) {
	isDragging = true;
	document.body.style.cursor = 'col-resize';
});

// Kada korisnik pomera miša
document.addEventListener('mousemove', function (e) {
	if (!isDragging) return;

	// Dobijanje novih širina za leve i desne panele na osnovu trenutne pozicije miša
	const containerWidth = divider.parentElement.offsetWidth;
	const leftWidth = (e.clientX / containerWidth) * 100;
	const rightWidth = 100 - leftWidth;

	// Ažuriraj širinu panela
	leftPanel.style.width = `${leftWidth}%`;
	rightPanel.style.width = `${rightWidth}%`;
});

// Kada korisnik pusti miša (prestane da vuče)
document.addEventListener('mouseup', function () {
	if (isDragging) {
		isDragging = false;
		document.body.style.cursor = 'default';
	}
});

// Funkcija za postavljanje potencijalnog broja ponude
async function setPotentialOfferNumber() {
	try {
		const offerData = await window.electronAPI.getPotentialOfferNumber();

		const yearString = offerData.godina.toString().slice(-2);
		const offerNumberString = offerData.broj.toString().padStart(3, '0');

		document.getElementById('ponudaGodina').textContent = yearString;
		document.getElementById('ponudaBroj').textContent = offerNumberString;

		// Snimi potencijalni broj ponude za kasniju upotrebu
		window.potentialOfferNumber = offerData.broj;
	} catch (error) {
		console.error('Error setting potential offer number:', error);
		Swal.fire({
			title: 'Greška',
			text: 'Došlo je do greške prilikom dobijanja broja ponude.',
			icon: 'error',
			confirmButtonText: 'OK',
		});
	}
}

async function resetProductInputs() {
	document.querySelector('[name=code]').value = '';
	document.querySelector('[name=manufacturer]').value = '';
	document.querySelector('[name=name]').value = '';
	document.querySelector('[name=model]').value = '';
	document.querySelector('[name=description]').value = '';
	document.querySelector('[name=price]').value = '0';
	document.querySelector("select[name=type]").value = 'P';
	document.querySelector("select[name=units]").value = 'kom';
	window.uploadedImageName = null;
	document.getElementById('imgInput').value = '';
	document.getElementById('imageContainer').style.backgroundImage = '';
	document.getElementById('imagePreview').src = 'http://simaks/img/products/dummy.jpg';

	document.querySelector('button[name="insertData"]').disabled = false;
	document.querySelector('button[name="insertData"]').classList.remove('text-disabled');
	document.querySelector('button[name="insertData"]').classList.add('text-primary');
	document.querySelector('button[name="updateData"]').disabled = true;
	document.querySelector('button[name="updateData"]').classList.remove('text-primary');
	document.querySelector('button[name="updateData"]').classList.add('text-disabled');
}

async function checkForDuplicateProduct(code, model) {
	return new Promise((resolve, reject) => {
		window.electronAPI.checkForDuplicateProduct(code, model);

		window.electronAPI.onDuplicateCheckResult((result) => {
			resolve(result);
		});
	});
}

function populateFormWithProduct(rowData) {
	document.querySelector('input[name="code"]').value = rowData.code;
	document.querySelector('select[name="type"]').value = rowData.type;
	document.querySelector('input[name="manufacturer"]').value = rowData.manufacturer;
	document.querySelector('input[name="name"]').value = rowData.name;
	document.querySelector('input[name="model"]').value = rowData.model;
	document.getElementById('imagePreview').src = `http://simaks/img/products/${rowData.img_url}`;
	document.querySelector('textarea[name="description"]').value = rowData.description;
	document.querySelector('select[name="units"]').value = rowData.unit;
	document.querySelector('input[name="price"]').value = rowData.price;

	document.querySelector('button[name="updateData"]').disabled = false;
	document.querySelector('button[name="updateData"]').setAttribute('data', rowData.id);
	document.querySelector('button[name="updateData"]').classList.add('text-primary');
	document.querySelector('button[name="updateData"]').classList.remove('text-disabled');
	document.querySelector('button[name="insertData"]').disabled = true;
	document.querySelector('button[name="insertData"]').classList.add('text-disabled');
	document.querySelector('button[name="insertData"]').classList.remove('text-primary');

}

document.querySelector('button[name="updateData"]').addEventListener('click', async (event) => {
	const dataID = event.currentTarget.getAttribute('data');
	const code = parseInt(document.querySelector("input[name=code]").value.trim(), 10);
	const type = document.querySelector("select[name=type]").value;
	const manufacturer = document.querySelector("input[name=manufacturer]").value.trim();
	const name = document.querySelector("input[name=name]").value.trim();
	const model = document.querySelector("input[name=model]").value.trim();
	const imageUrl = document.getElementById('imagePreview').src;
	const image = imageUrl.split('/').pop() || "dummy.jpg";
	const description = document.querySelector("textarea[name=description]").value.trim();
	const unit = document.querySelector("select[name=units]").value;
	const price = parseFloat(document.querySelector("input[name=price]").value.trim()).toFixed(2); // Obezbedite da je float sa dve decimale

	// Validacija obaveznih polja
	if (!code || !model) {
		Swal.fire({
			title: 'Greška',
			text: 'Polja ŠIFRA i OZNAKA su obavezni...',
			icon: 'error',
			confirmButtonText: 'OK'
		});
		return;
	}

	try {
		let image = "dummy.jpg"; // Podrazumevani naziv slike
		const imageInput = document.getElementById('imgInput');
		const imagePreview = document.getElementById('imagePreview');

		if (imageInput.files && imageInput.files.length > 0) {
			// Korisnik je izabrao novu sliku, pošalji je na server
			const file = imageInput.files[ 0 ];
			const uploadedImageName = await uploadImage(file); // Poziv funkcije za upload slike
			if (uploadedImageName) {
				image = uploadedImageName; // Ažuriraj naziv slike nakon uspešnog uploada
			}
		} else {
			// Korisnik nije izabrao novu sliku, zadrži postojeću
			image = imagePreview.src.split('/').pop(); // Zadrži naziv trenutne slike
		}
		// Ako artikal ne postoji, nastavljamo sa ažuriranjem
		const updatedData = {
			code: code,
			type: type,
			manufacturer: manufacturer,
			name: name,
			model: model,
			img_url: image,
			description: description,
			unit: unit,
			price: price,
		};

		const tableName = 'products';
		const conditionString = 'id = ?';
		const conditionValues = [ parseInt(dataID, 10) ];

		const result = await window.electronAPI.updateData({ tableName, data: updatedData, conditionString, conditionValues });

	} catch (error) {
		console.error('Error during update:', error);
		Swal.fire({
			title: 'Greška',
			text: 'Došlo je do greške prilikom ažuriranja!',
			icon: 'error',
			confirmButtonText: 'OK'
		});
	}
});

window.electronAPI.onDataUpdated((result) => {
	const swalResult = Swal.fire({
		title: 'Uspeh',
		text: 'Proizvod je uspešno azuriran!',
		icon: 'success',
		confirmButtonText: 'OK'
	})
		.then((result) => {
			if (result.isConfirmed) {
				window.electronAPI.fetchData('products', '*', 'ORDER BY code DESC');
				resetProductInputs();
				document.querySelector('button[name="updateData"]').disabled = true;
				document.querySelector('button[name="updateData"]').classList.add('text-disabled');
				document.querySelector('button[name="updateData"]').classList.remove('text-primary');
				document.querySelector('button[name="insertData"]').disabled = false;
				document.querySelector('button[name="insertData"]').classList.add('text-primary');
				document.querySelector('button[name="insertData"]').classList.remove('text-disabled');
				setTimeout(() => {
					const codeInput = document.querySelector('[name=code]');
					if (codeInput) {
						codeInput.focus();
					} else {
						console.log('Ne postoji input polje za sifru!');
					}
				}, 0);
			}
		});
});

document.querySelector('button[name="clearInputs"]').addEventListener('click', () => {
	resetProductInputs();
});

document.getElementById('getOffers').addEventListener('click', async () => {
	try {
		const offersData = await getDataFromDB('offers');
		const offersList = document.getElementById('offers-list');
		offersData.forEach((item) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${item.offer_number}</td>
				<td>${item.status}</td>
			`;
			offersList.appendChild(tr);
		});	
	} catch (error) {
		console.error('Greška pri preuzimanju ponuda:', error);
	}
});

function getDataFromDB(tableName, columns = '*', condition = ''){
    return new Promise((resolve, reject) => {
        // Pošaljite zahtev main procesu
        window.electronAPI.getDataFromDB(tableName, columns, condition);

        // Postavite listener koji će čekati na podatke
        const handleDataRetrieved = (data) => {
            resolve(data);
            // Uklonite listener nakon što dobijete podatke
            window.electronAPI.offDataRetrievedFromDB(handleDataRetrieved);
        };

        // Slušajte događaj za povrat podataka
        window.electronAPI.onDataRetrievedFromDB(handleDataRetrieved);
    });
}

function createSanitizedText(text) {
	return DOMPurify.sanitize(text);
}

