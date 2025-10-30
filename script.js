document.getElementById('matchButton').addEventListener('click', function () {
    const maleFile = document.getElementById('maleFile').files[0];
    const femaleFile = document.getElementById('femaleFile').files[0];

    if (!maleFile || !femaleFile) {
        alert('لطفاً هر دو فایل را بارگذاری کنید.');
        return;
    }

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                resolve(jsonData);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    Promise.all([readFile(maleFile), readFile(femaleFile)]).then(([males, females]) => {
        const results = [];

        males.forEach(male => {
            females.forEach(female => {
                // بررسی شرایط
                if ((male.state === female.state && 
                    (male.city === female.city || male.city !== female.city)) && 
                    (male.age - female.age) >= -5 && 
                    (male.age - female.age) <= 10) {
                    results.push({
                        آقا: male.name,
                        "سن آقا": male.age,
                        "کد آقا": male.ID,
                        استان:male.state,
                        شهر: male.city,
                        خانم: female.name,
                        "سن خانم": female.age,
                        "کد خانم": female.ID,
                        "استان خانم": female.state,
                        "شهر خانم":female.city,
                    });
                }
            });
        });

        // نمایش نتایج
        document.getElementById('results').textContent = JSON.stringify(results, null, 2);
    }).catch(error => {
        console.error('Error reading files:', error);
    });
});