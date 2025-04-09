document.addEventListener("DOMContentLoaded", () => {
    const fetchButton = document.getElementById("fetchButton");
    const downloadButton = document.getElementById("downloadButton");
    fetchButton.addEventListener("click", fetchUsers);
    downloadButton.addEventListener("click", downloadList);
});

let fetchedData = {}; // Store fetched data globally

async function fetchUsers() {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const genderFilter = document.getElementById("genderFilter").value;
    console.log(startDate, startTime, endDate, endTime)
    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    try {
        const MAIN_API = "https://nonucure-bot.vercel.app/api";

        const response = await fetch(`${MAIN_API}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ startDate, endDate, startTime, endTime })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        fetchedData = await response.json(); // Store fetched data
        //check if data is empty
        if (!fetchedData || (!fetchedData.maleUsers?.length &&!fetchedData.femaleUsers?.length)) {
            alert('No data available for the selected date range.');
            return;
        }
        populateTable(fetchedData, genderFilter);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function populateTable(data, genderFilter) {
    const usersBody = document.getElementById("usersBody");
    const maleColumns = document.querySelectorAll('.male-column');
    const femaleColumns = document.querySelectorAll('.female-column');

    // Show/hide gender-specific columns based on filter
    const showMaleColumns = !genderFilter || genderFilter === 'Male';
    const showFemaleColumns = !genderFilter || genderFilter === 'Female';
    
    maleColumns.forEach(col => col.style.display = showMaleColumns ? '' : 'none');
    femaleColumns.forEach(col => col.style.display = showFemaleColumns ? '' : 'none');
    usersBody.innerHTML = "";

    // Check if data is empty or filtered data is empty
    const hasData = data && ((showMaleColumns && data.maleUsers?.length) || (showFemaleColumns && data.femaleUsers?.length));
    if (!hasData) {
        const emptyRow = document.createElement("tr");
        const colspan = genderFilter === 'Male' ? 12 : (genderFilter === 'Female' ? 10 : 12);
        emptyRow.innerHTML = `<td colspan="${colspan}" style="text-align: center; padding: 20px;">No records found for selected criteria</td>`;
        usersBody.appendChild(emptyRow);
        return;
    }

    // Filter users based on gender
    let users = [];
    if (genderFilter === 'Male') {
        users = data.maleUsers;
    } else if (genderFilter === 'Female') {
        users = data.femaleUsers;
    } else {
        users = [...data.maleUsers, ...data.femaleUsers];
    }

    // Create a map for recommendations by userId with improved formatting
    const recommendationsMap = {};
    const formatRecommendation = (rec) => ({
        kit: rec.kit || 'No Kit Assigned',
        products: rec.products && rec.products.length ? rec.products.join(', ') : 'No Products Assigned'
    });

    if (data.maleRecommendations) {
        data.maleRecommendations.forEach(rec => {
            recommendationsMap[rec.userId] = formatRecommendation(rec);
        });
    }
    
    if (data.femaleRecommendations) {
        data.femaleRecommendations.forEach(rec => {
            recommendationsMap[rec.userId] = formatRecommendation(rec);
        });
    };

    // Sort users by name
    users.sort((a, b) => a.name.localeCompare(b.name));

    // Populate users
    users.forEach(user => {
        const row = document.createElement("tr");
        let rowHtml = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.gender}</td>`;
          

        // Add male-specific columns
        if (user.gender === 'Male') {
            rowHtml += `
                <td>${user.healthConcern}</td>
                <td class="male-column">${user.hairStage || 'N/A'}</td>
                <td class="male-column">${user.dandruff || 'N/A'}</td>
                <td class="male-column">${user.dandruffStage || 'N/A'}</td>
                <td class="male-column">${user.thinningOrBaldSpots || 'N/A'}</td>
                <td class="male-column">${user.energyLevels || 'N/A'}</td>`;
        } else {
            rowHtml += `
                <td class="female-column">${user.mainConcern || 'N/A'}</td>
                <td class="female-column">${user.naturalHair || 'N/A'}</td>
                <td class="female-column">${user.goal || 'N/A'}</td>
                <td class="female-column">${user.hairFall || 'N/A'}</td>`;
                
        }
            
        const userRecommendation = recommendationsMap[user._id] || { kit: 'No Kit Assigned', products: 'No Products Assigned' };
        rowHtml += `<td>${userRecommendation.kit}</td>
                   <td>${userRecommendation.products}</td>`;
        row.innerHTML = rowHtml;
        usersBody.appendChild(row);
    });
    
}

function downloadList() {
    if (!fetchedData || (!fetchedData.maleUsers?.length && !fetchedData.femaleUsers?.length)) {
        alert('No data available to download. Please fetch data first.');
        return;
    }

    // Prepare male users data with improved formatting
    const maleUsers = (fetchedData.maleUsers || []).map(user => {
        const recommendation = fetchedData.maleRecommendations?.find(rec => rec.userId === user._id) || {};
        return {
            Name: user.name || 'N/A',
            Email: user.email || 'N/A',
            Phone: user.phone || 'N/A',
            Gender: user.gender || 'N/A',
            'Health Concern': user.healthConcern || 'N/A',
            'Hair Stage': user.hairStage || 'N/A',
            Dandruff: user.dandruff || 'N/A',
            'Dandruff Stage': user.dandruffStage || 'N/A',
            'Thinning/Bald Spots': user.thinningOrBaldSpots || 'N/A',
            'Energy Levels': user.energyLevels || 'N/A',
            Kit: recommendation.kit || 'No Kit Assigned',
            Products: recommendation.products?.length ? recommendation.products.join(', ') : 'No Products Assigned'
        };
    });

    // Prepare female users data with improved formatting
    const femaleUsers = (fetchedData.femaleUsers || []).map(user => {
        const recommendation = fetchedData.femaleRecommendations?.find(rec => rec.userId === user._id) || {};
        return {
            Name: user.name || 'N/A',
            Email: user.email || 'N/A',
            Phone: user.phone || 'N/A',
            Gender: user.gender || 'N/A',
            'Main Concern': user.mainConcern || 'N/A',
            'Natural Hair': user.naturalHair || 'N/A',
            Goal: user.goal || 'N/A',
            'Hair Fall': user.hairFall || 'N/A',
            Kit: recommendation.kit || 'No Kit Assigned',
            Products: recommendation.products?.length ? recommendation.products.join(', ') : 'No Products Assigned'
        };
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const maleSheet = XLSX.utils.json_to_sheet(maleUsers);
    const femaleSheet = XLSX.utils.json_to_sheet(femaleUsers);

    // Append sheets to the workbook
    XLSX.utils.book_append_sheet(wb, maleSheet, "Male Users");
    XLSX.utils.book_append_sheet(wb, femaleSheet, "Female Users");

    // Write the workbook to a file
    XLSX.writeFile(wb, "UserRecommendations.xlsx");
}