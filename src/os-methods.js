import os, { cpus }  from 'node:os';

export let osObject = {
    eol() {
        console.log(JSON.stringify(os.EOL));
    },
    cpus() {
        const arrCpus = os.cpus();
        for (let i = 0; i< arrCpus.length; i++){
            delete arrCpus[i].times
        };
        console.log(arrCpus);
    },
    homeDir() {
        console.log(os.homedir());
    },
    userName() {
        const osInfo = os.userInfo();
        console.log(osInfo.username);
    },
    arch() {
        console.log(os.arch());
    }
};