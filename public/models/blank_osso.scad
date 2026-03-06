$fn = 60;
altura = 3;

module osso_com_argola() {
    union() {
        // Corpo do Osso
        translate([-15, -7, 0]) cube([30, 14, altura]);
        translate([-15, 6, 0]) cylinder(h=altura, r=10);
        translate([-15, -6, 0]) cylinder(h=altura, r=10);
        translate([15, 6, 0]) cylinder(h=altura, r=10);
        translate([15, -6, 0]) cylinder(h=altura, r=10);
        
        // A Argola (Olhal) no topo esquerdo
        translate([-0, 10, 0]) 
        difference() {
            cylinder(h=altura, r=5); // Aro exterior
            translate([0, 0, -1]) cylinder(h=altura+2, r=2.5); // Buraco da argola
        }
    }
}
osso_com_argola();