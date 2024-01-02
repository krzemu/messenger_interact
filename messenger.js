class Messenger {
    constructor({ width = '350px', height = '150px', bannerQ = 3 } = {}) {
        this.props = {
            width,
            height,
            side: 'right'
        }
        this.bannerQ = bannerQ;
        this.createWrapper();
        this.createBanners();
        this.bannerInterval();
        this.createDropzone();
        this.setInteractable();
    }

    createWrapper() {
        const { createElement } = this;
        this.wrapper = createElement({
            style: `position:fixed; bottom:0; right:0; z-index:10`,
            classList: 'messWrapper',
            container: document.body
        });
        this.innerWrapper = createElement({
            style: 'position:relative; width:100%; height:100%;',
            classList: 'messInner',
            container: this.wrapper
        });
    }

    createBanners() {
        const { createElement, innerWrapper, bannerQ } = this;
        this.banners = [];
        for (let i = 0; i < bannerQ; i++) {
            this.banners.push(createElement({
                className: 'banner',
                style: `max-width:300px; display:none; z-index:${i + 1 * 3}`,
                content: `
                <div class="banner-innerWrapper" style="display:flex; align-items:center; gap:.5em; max-width:300px; flex-direction:row-reverse; position:fixed; bottom:2em; right:0;">
                    <div class="icon-side" style="width:60px; height:100%; display:flex; align-items:center;justify-content:center">
                        <div style="width:60px; height:60px; border-radius:50%; background:red; box-shadow:1px 1px 4px rgba(0,0,0, 0.25)">
                            <a href="https://google.com" target="_blank" style="display:block; width:inherit; height:inherit;"></a>
                        </div>
                    </div>
                    <div class="mess-side" style="width:240px; display:flex; justify-content:center; align-items:center; position:absolute; top:0; bottom:0; left:-240px; margin-top:auto; margin-bottom:auto;">
                        <a href="https://google.com" target="_blank" style="width:100%; height:max-content">
                            <div style="width:100%; height:max-content; padding:1rem; background-image:linear-gradient(90deg, pink, orange); border-radius:1rem; box-shadow:1px 1px 4px rgba(0,0,0, 0.25)">
                                <div style="font-weight:500; font-size:1.2rem">
                                    Magda 25L.
                                </div>
                                <div>
                                    Hot kea njkdn sd ksd a
                                </div>
                            </div>
                        </a>
                    </div>
                </div>`,
                container: innerWrapper
            }));
        }
    }

    bannerEntry(index) {
        const { banners, props } = this;
        if (!banners[index]) return;
        let banner = banners[index];

        const tl = gsap.timeline({
            delay: .2,
            defaults: {
                duration: .3
            }
        });
        tl.set(banner, { display: 'block' });
        tl.fromTo(banner.querySelector('.icon-side'),
            { opacity: 0, x: this.props.side === 'right' ? -100 : 100, scale: .7 },
            { opacity: 1, x: 0, scale: 1 });
        tl.fromTo(banner.querySelector('.mess-side'),
            { opacity: 0, x: this.props.side === 'right' ? 100 : -100, scale: .7 },
            { opacity: 1, x: 0, scale: 1 },
        );
        setTimeout(() => {
            const tl = gsap.timeline();
            tl.to(banner.querySelector('.mess-side'), { opacity: 0, x: props.side === 'right' ? 100 : -100, scale: .7, duration: .3 });
            tl.to(banner.querySelector('.mess-side'), { display: 'none' });
        }, 3500);
    }

    bannerInterval() {
        const { banners } = this;
        let time = this.getRandTime(2, 4);
        for (let i = 0; i < banners.length; i++) {
            console.log(time * (i + 1));
            setTimeout(() => {
                console.log('banner entry');
                this.bannerEntry(i);
            }, time * (i + 2));
        }
    }

    setInteractable() {
        const { innerWrapper, closeWrapper, props, banners } = this;
        this.interactable = new Draggable(innerWrapper, {
            dragStartCallback({ element, position, interactable, event }) {
                gsap.set(closeWrapper, { display: 'block' });
                gsap.to(closeWrapper, { opacity: 1, duration: .3 });
            },

            dragStopCallback({ element, position }) {
                if (-1 * position.x > window.innerWidth / 2) {
                    // element.querySelectorAll('.banner-innerWrapper').forEach(item => item.style.flexDirection = 'row')
                    banners.forEach(banner => {
                        gsap.set(banner.querySelector('.mess-side'), { left: '60px' });
                    })
                    props.side = 'left';
                } else {
                    // element.querySelectorAll('.banner-innerWrapper').forEach(item => item.style.flexDirection = 'row-reverse')
                    banners.forEach(banner => {
                        gsap.set(banner.querySelector('.mess-side'), { left: '-240px' });
                    })
                    props.side = 'right'
                }
                const tl = gsap.timeline();
                tl.to(closeWrapper, { opacity: 0, duration: .3 });
                tl.set(closeWrapper, { display: 'none' });
            },
        });
    }

    createDropzone() {
        const { createElement } = this;
        this.closeWrapper = createElement({
            content: 'X',
            style: 'width:100%; height:25vh; background-color:#00000055; display:flex; justify-content:center; align-items:center;color:#fff; font-size:3em; position:fixed; bottom:0; display:none;',
            container: document.body,
            className: 'mess__closeContainer'
        })
        console.log(this.closeWrapper);
        this.closeDropzone = new Dropzone('.mess__closeContainer', {
            onDropCallback({ event, element }) {
                console.log('drop');
            }
        })
        console.log(this.closeDropzone);

    }

    // utilities
    createElement({ type, content, style, className, container } = {}) {
        const el = document.createElement(type || 'div');
        el.innerHTML = content || '';
        el.style = style || '';
        el.classList = className || '';
        container && container.append(el);
        return el;
    }

    getRandTime(min, max) {
        return (Math.random() * (max - min) + min) * 1000;
    }
}