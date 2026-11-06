class MenuSwitch {
    static init(){
        const THIS = new MenuSwitch();

        THIS.events()
    }

    events(){
        this.listenAdminChoice();
    }

    listenAdminChoice(){

        const adminSwitches = document.querySelectorAll('.wp-dark-mode-switches-item.wp-dark-mode-menu-switch-admin');

        // Add active class to the first admin switch if no admin switch is active
        if(!document.querySelector('.wp-dark-mode-switches-item.wp-dark-mode-menu-switch-admin.active')) {
            adminSwitches[0]?.classList.add('active');
        }

        // Listen for admin switch click dynamic.
        document.addEventListener('click', e => {

            // Bail, if target or closest is not admin switch
            if ( !e.target.closest('.wp-dark-mode-switches-item.wp-dark-mode-menu-switch-admin') && !e.target.classList.contains('wp-dark-mode-menu-switch-admin') ) return;

            const adminSwitch = e.target;

            const styleId = adminSwitch.getAttribute('data-style'); 
            // Closest wp-dark-mode-switches-panel > input[type="hidden"]
            adminSwitch.closest('.wp-dark-mode-switches-panel').querySelector('input[type="hidden"]').value = styleId;
            
            // remove active class from all admin switches
            adminSwitch.closest('.wp-dark-mode-switches-panel').querySelectorAll('.wp-dark-mode-menu-switch-admin').forEach(adminSwitch => {
                adminSwitch.classList.remove('active');
            });

            // add active class to the clicked admin switch
            adminSwitch.classList.add('active');
            
        });
       
    }
}

export default MenuSwitch;