(function(){
    'use strict';

    function getAnnouncements(){
        try{
            return JSON.parse(localStorage.getItem('announcements') || '[]');
        }catch(e){
            return [];
        }
    }

    function saveAnnouncement(ann){
        const arr = getAnnouncements();
        arr.unshift(ann);
        localStorage.setItem('announcements', JSON.stringify(arr));
    }

    function timeAgo(iso){
        const now = Date.now();
        const then = new Date(iso).getTime();
        const seconds = Math.floor((now - then) / 1000);
        if (seconds < 60) return seconds + 's';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return minutes + 'm';
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return hours + 'h';
        const days = Math.floor(hours / 24);
        return days + 'd';
    }

    function escapeHtml(str){
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderAnnouncements(){
        const container = document.getElementById('announcementsList');
        if (!container) return;
        const items = getAnnouncements();
        // Insert stored announcements before existing static content
        items.forEach(item => {
            const dotClass = (item.priority === 'red') ? 'urgent' : (item.priority === 'orange' ? 'spoed' : 'niet_urgent');
            const el = document.createElement('div');
            el.className = 'activity-item';
            el.innerHTML = '\n                <div class="activity-dot ' + dotClass + '"></div>\n                <div class="flex-1">\n                    <p class="activity-message">' + escapeHtml(item.title) + (item.building ? ' — ' + escapeHtml(item.building) : '') + '</p>\n                    <p class="activity-time">' + timeAgo(item.createdAt) + ' ago</p>\n                </div>\n            ';
            container.prepend(el);
        });
    }

    // Hook the form on the announcements page
    document.addEventListener('DOMContentLoaded', function(){
        const form = document.getElementById('aankondigingForm');
        if (form){
            form.addEventListener('submit', function(e){
                e.preventDefault();
                const title = document.getElementById('aankondigingTitel').value.trim();
                const message = document.getElementById('aankondigingBericht').value.trim();
                const priorityEl = document.getElementById('announcementPriority');
                const priority = priorityEl ? priorityEl.value : 'blue';
                const buildingEl = document.getElementById('aankondiginggebouw');
                const building = buildingEl ? buildingEl.value : '';
                if (!title || !message) return;
                const ann = {
                    id: Date.now(),
                    title: title,
                    message: message,
                    priority: priority,
                    building: building,
                    createdAt: new Date().toISOString()
                };
                saveAnnouncement(ann);
                // Redirect back to dashboard (same folder)
                window.location.href = 'dashboard.html';
            });
        }

        // Always try to render announcements (for the dashboard)
        renderAnnouncements();
    });

})();
