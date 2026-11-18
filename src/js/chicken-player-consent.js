// Consentement dont dépend chaque player, gardé hors du DOM : une classe se retire trop facilement
const playerConsents = new WeakMap();

class ChickenPlayerConsent {
    constructor(playerType, config) {
        this.consentState = false;

        this.needConsent = config.cookies.active;
        this.consentEvent = config.cookies.eventConsent;
        this.rejectEvent = config.cookies.eventReject;
        this.consentState = !this.needConsent;

        this.config = config;
        this.playerType = playerType;

        this.wrappers = this.getWrappers();

        this.setPlayerConsent();

        // Aucun player de ce type dans cette initialisation : rien à écouter
        if (!this.wrappers.length) return;

        this.wrappers.forEach(wrapper => playerConsents.set(wrapper, this));

        if (this.needConsent) {
            this.setConsentMessage();
            this.setWrapperState();
        }

        if (this.needConsent && this.consentEvent) {
            window.addEventListener(this.consentEvent, () => {
                this.consentState = true;
                this.setWrapperState();
            });
        }

        if (this.needConsent && this.rejectEvent) {
            window.addEventListener(this.rejectEvent, () => {
                this.consentState = false;
                this.setWrapperState();
            });
        }
    }

    /**
     * Players de ce type gérés par l'initialisation en cours : ceux du sélecteur de l'instance, pas encore liés
     * @returns {HTMLElement[]} Wrappers
     */
    getWrappers() {
        const { wrapper, stateReady } = this.config.classes;

        return [...document.querySelectorAll(this.config.selector)].filter(el =>
            el.classList.contains(wrapper) &&
            el.classList.contains(`player--${this.playerType}`) &&
            !el.classList.contains(stateReady)
        );
    }

    setWrapperState() {
        this.wrappers.forEach(wrapper => {
            if (this.consentState) {
                wrapper.classList.remove(this.config.classes.needConsent);
            } else {
                wrapper.classList.add(this.config.classes.needConsent);
            }
        });
    }

    setConsentMessage() {
        this.wrappers.forEach(wrapper => {
            const cover = wrapper.querySelector(`.${this.config.classes.cover}`);
            if (!cover) return;

            // Ne pas ajouter si déjà présent
            if (cover.querySelector(`.${this.config.classes.consentMessage}`)) return;

            const div = document.createElement("div");
            div.className = this.config.classes.consentMessage;
            div.innerHTML = `<p>${this.config.cookies.message}</p>`;
            cover.appendChild(div);
        });
    }

    setPlayerConsent() {
        if (this.config.player[this.playerType]?.cookies?.active) {
            this.needConsent = this.config.player[this.playerType].cookies.active
        }

        if (this.config.player[this.playerType]?.cookies?.eventConsent) {
            this.consentEvent = this.config.player[this.playerType].cookies.eventConsent
        }

        if (this.config.player[this.playerType]?.cookies?.eventReject) {
            this.rejectEvent = this.config.player[this.playerType].cookies.eventReject
        }

        this.consentState = !this.needConsent;
    }

    hasConsent() {
        return this.consentState;
    }

    /**
     * Le player attend-il le consentement ? Tout player, quelle que soit son instance
     * @param {HTMLElement} el - Wrapper du player
     * @returns {boolean} true si la vidéo ne doit pas être chargée
     */
    static isWaiting(el) {
        const consent = playerConsents.get(el);
        return !!consent && !consent.hasConsent();
    }
}

export default ChickenPlayerConsent; 