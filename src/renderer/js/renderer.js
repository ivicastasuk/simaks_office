console.log(window.electronAPI);
console.log(window.sweetAlert);
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
	window.electronAPI.fetchData('products');
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
		tdImage.innerHTML = `<img src="./img/products/${row.img_url}" class="w-12 h-12 border">`;
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

// Ubacivanje podataka u bazu
document.querySelectorAll('button[name=insertData]').forEach((button, index) => {
	button.addEventListener('click', () => {
		const code = document.querySelector("input[name=code]").value;
		const type = document.querySelector("select[name=type]").value;
		const manufacturer = document.querySelector("input[name=manufacturer]").value;
		const name = document.querySelector("input[name=name]").value;
		const model = document.querySelector("input[name=model]").value;
		const image = document.querySelector("input[name=image]").files[0].name;
		const description = document.querySelector("textarea[name=description]").value;
		// const items = document.querySelector("input[name=items]").value;
		const unit = document.querySelector("select[name=units]").value;
		const price = document.querySelector("input[name=price]").value;
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
		window.electronAPI.insertData('products', data);
	});
// document.getElementById('insertData').addEventListener('click', () => {
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

document.getElementById('imgInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        const response = await window.electronAPI.saveImage(file.name, event.target.result);
        if (response.success) {
            document.getElementById('imagePreview').src = response.path;
        } else {
            console.error('Failed to save the image:', response.message);
        }
    };
    reader.readAsArrayBuffer(file);
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