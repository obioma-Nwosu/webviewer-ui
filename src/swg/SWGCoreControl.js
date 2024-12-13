import core from 'core';

class SWG {
  constructor() {
    this.userRole = 50;
  }

  getUserRole = () => this.userRole;

  setUserRole = (userRole) => {
    this.userRole = userRole;
  };
}

core.swg = new SWG();
