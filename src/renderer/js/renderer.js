// console.log(window.electronAPI);
// console.log(window.sweetAlert);
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
            console.log('Login successful:', result);
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

		if(!code || !name || !model){
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

		if(!clientName){
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
		});
		document.querySelector(`#content${index + 1}`).classList.remove('hidden');

        if (`content${index + 1}` === 'content1') {
            window.electronAPI.fetchUser('users');
        }
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

document.getElementById("imageContainer").addEventListener("click", openFileDialog);
// document.getElementById("imgInput").addEventListener("change", previewImage);

function openFileDialog(){
	document.getElementById("imgInput").click();
}

function previewImage() {
	const file = document.getElementById('imgInput').files[0];
		if (!file) {
		console.log('Nijedan fajl nije izabran.');
		return;
	}

	const reader = new FileReader();

	reader.onload = function(e) {
		document.getElementById('imageContainer').style.backgroundImage = `url(${e.target.result})`;
	};

	reader.onerror = function(e) {
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
document.getElementById('imgInput').addEventListener('change', async function(event) {
    const file = event.target.files[0];
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


// Handle the fetched user data
// window.electronAPI.onUserFetched((data) => {

// 	document.querySelector('input[name=userUsername]').value = '';
// 	document.querySelector('input[name=userPassword]').value = '';
// 	document.querySelector('input[name=userFirstName]').value = '';
// 	document.querySelector('input[name=userLastName]').value = '';
// 	document.querySelector('input[name=userEmail]').value = '';
// 	document.querySelector('input[name=userPhone]').value = '';
	
//     data.forEach(user => {
// 		document.querySelector('input[name=userUsername]').value = user.username;
// 		document.querySelector('input[name=userUsername]').value = user.username;
// 		document.querySelector('input[name=userUsername]').value = user.username;
// 		document.querySelector('input[name=userUsername]').value = user.username;
// 		document.querySelector('input[name=userUsername]').value = user.username;
// 		document.querySelector('input[name=userUsername]').value = user.username;
//     });
	
// });

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

function saveLoggedUser(user) {
	localStorage.setItem("user", JSON.stringify(user));
}