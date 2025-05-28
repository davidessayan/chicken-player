class ChickenPlayerConsent {
    constructor(playerType, config) {
        this.consentState = false;

        this.needConsent = config.cookies.active;
        this.consentEvent = config.cookies.eventConsent;
        this.rejectEvent = config.cookies.eventReject;
        this.consentState = !this.needConsent;

        this.config = config;
        this.playerType = playerType;

        this.wrapper = document.querySelector(`.${config.classes.wrapper}`);;

        this.setPlayerConsent();

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

    setWrapperState() {
        if (this.consentState) {
            this.wrapper.classList.remove(this.config.classes.needConsent);
        } else {
            this.wrapper.classList.add(this.config.classes.needConsent);
        }
    }

    setConsentMessage() {
        const cover = this.wrapper.querySelector(`.${this.config.classes.cover}`);
        if (!cover) return;

        const consentMessage = document.createElement('div');
        consentMessage.className = this.config.classes.consentMessage;
        consentMessage.innerHTML = `
            <p>${this.config.cookies.message}</p>
        `;

        cover.appendChild(consentMessage);
    }

    setPlayerConsent() {
        if (this.config.player[this.playerType]?.cookies?.active) {
            this.needConsent = this.config.player[this.playerType].cookies.active
            this.wrapper = document.querySelector(`.${this.config.classes.wrapper}.player--${this.playerType}`);
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
}

export default ChickenPlayerConsent; 