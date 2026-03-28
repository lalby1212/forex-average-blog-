// ═══════════════════════════════════════════════════════════
// __MC-VALIDATE.JS - Validation Mailchimp (Simplifié)
// ═══════════════════════════════════════════════════════════

(function() {
    'use strict';

    // Vérifier si Mailchimp est configuré
    const mcForms = document.querySelectorAll('form[id*="mc"]');
    
    if (mcForms.length === 0) {
        console.log('ℹ️ Pas de formulaire Mailchimp trouvé');
        return;
    }

    // Configuration minimale pour éviter les erreurs
    window.mc4wp = window.mc4wp || {
        listeners: [],
        loaded: false,
        trigger: function(event, data) {
            this.listeners.forEach(listener => {
                if (listener.event === event) {
                    listener.callback(data);
                }
            });
        },
        on: function(event, callback) {
            this.listeners.push({ event: event, callback: callback });
        }
    };

    console.log('✅ Mailchimp validation loaded (minimal)');

})();
