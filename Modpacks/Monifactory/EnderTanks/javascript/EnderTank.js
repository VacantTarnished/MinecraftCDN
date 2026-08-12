class EnderTank {
  COLOR_MAP = {
    '0': {
      name: 'white',
      color: '#F9FFFE'
    },
    '1': {
      name: 'orange',
      color: '#F9801D'
    },
    '2': {
      name: 'magenta',
      color: '#C74EBD'
    },
    '3': {
      name: 'light_blue',
      color: '#3AB3DA'
    },
    '4': {
      name: 'yellow',
      color: '#FED83D'
    },
    '5': {
      name: 'lime',
      color: '#80C71F'
    },
    '6': {
      name: 'pink',
      color: '#F38BAA'
    },
    '7': {
      name: 'gray',
      color: '#474F52'
    },
    '8': {
      name: 'light_gray',
      color: '#9D9D97'
    },
    '9': {
      name: 'cyan',
      color: '#169C9C'
    },
    'A': {
      name: 'purple',
      color: '#8932B8'
    },
    'B': {
      name: 'blue',
      color: '#3C44AA'
    },
    'C': {
      name: 'brown',
      color: '#835432'
    },
    'D': {
      name: 'dark_green',
      color: '#5E7C16'
    },
    'E': {
      name: 'red',
      color: '#B02E26'
    },
    'F': {
      name: 'black',
      color: '#1D1D21'
    }
  };
  COLOR_CONTAINER_CLASS = 'color-container';
  COLOR_BOX_CLASS = 'color-box';

  constructor(code, fluid) {
    this.code = code;
    this.fluid = fluid;
  }

  getTr() {
    const tr = document.createElement('tr');

    const codeTd  = document.createElement('td');
    const colorTd = document.createElement('td');
    const fluidTd  = document.createElement('td');

    const colorContainer = document.createElement('div');
    colorContainer.classList.add(this.COLOR_CONTAINER_CLASS);
    
    for (let color of this.code) {
      const backgroundColor = this.COLOR_MAP[color];

      const colorDiv = document.createElement('div');
      colorDiv.title = backgroundColor.name;
      colorDiv.style.backgroundColor = backgroundColor.color;
      colorDiv.classList.add(this.COLOR_BOX_CLASS);

      colorContainer.appendChild(colorDiv);
    }

    codeTd.innerText = this.code;
    colorTd.appendChild(colorContainer);
    fluidTd.innerText = this.fluid;

    tr.appendChild(codeTd);
    tr.appendChild(colorTd);
    tr.appendChild(fluidTd);

    const removeButton = document.createElement('button');
    removeButton.innerText = 'X';
    removeButton.addEventListener('click', async () => {
      const response = await MinecraftCdn.removeEnderTank(this.code);

      if (response.status == 200) {
        document.querySelector('tbody').removeChild(tr);
      }
    });


    tr.appendChild(removeButton);

    return tr;
  }
  
  code;
  fluid;
}