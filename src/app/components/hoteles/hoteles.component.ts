import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel';
import { HotelesService } from '../../services/hoteles.service';


@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css'],
})
export class HotelesComponent implements OnInit {
  Nombre = 'Hoteles';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)',
  };
  AccionABMC = 'L';
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...',
  };
  Items: Hotel[] = null;
  FormRegistro: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private hotelesService: HotelesService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      IdHotel: [0],
      Nombre: ['', [Validators.required, Validators.maxLength(100)]],
      MaxPasajeros: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')],
      ],
      FechaAlta: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          ),
        ],
      ],
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activado: true, IdHotel: 0 });
    this.submitted = false;
  }

  Buscar() {
    this.hotelesService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  BuscarPorId(Hotel, AccionABMC) {
    window.scroll(0, 0);

    this.hotelesService.getById(Hotel.IdHotel).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      var arrFecha = res.FechaAlta.substr(0, 10).split('-');
      this.FormRegistro.controls.FechaAlta.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );

      this.AccionABMC = AccionABMC;
    });
  }

  Consultar(Hotel) {
    this.BuscarPorId(Hotel, 'C');
  }

  Modificar(Hotel) {
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(Hotel, 'M');
  }

  Grabar() {
    this.submitted = true;

    if (this.FormRegistro.invalid) {
      return;
    }

    const itemCopy = { ...this.FormRegistro.value };

    var arrFecha = itemCopy.FechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    if (this.AccionABMC == 'A') {
      itemCopy.Vigente = true;
      this.hotelesService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        console.log();

        this.Buscar();
      });
    } else {
      this.hotelesService
        .put(itemCopy.IdHotel, itemCopy)
        .subscribe((res: any) => {
          this.Volver();

          this.Buscar();
        });
    }
  }

  Volver() {
    this.AccionABMC = 'L';
  }
}
