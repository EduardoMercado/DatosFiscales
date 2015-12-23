Template.cambiaDatosDialog.helpers({

    selected: function () {
        var elRFC = RFCs.findOne({_id:Session.get("selected_rfc")});
        if (elRFC.rfc == 'XEXX010101000')
            Session.set('extranjero', true);
        return elRFC;
    },

    error: function () {
        return Session.get("createError");
    },

    extranjero: function(){
        return Session.get('extranjero');
    }
});

Template.cambiaDatosDialog.events({
    'change .estado': function(event, template){
        var estado = template.find(".estado").value;
        if (estado == 'Extranjero')
            Session.set('extranjero', true);
    },
    'click .save': function (event, template) {
        var rfc = template.find(".rfc").value.trim().toUpperCase();
        var razonSocial = template.find(".razonSocial").value;
        var calle = template.find(".calle").value;
        var numExt = template.find(".numExt").value;
        var numInt = template.find(".numInt").value.trim();
        var colonia = template.find(".colonia").value;
        var municipio = template.find(".municipio").value;
        var estado = template.find(".estado").value;
        var codigoPostal = template.find(".codigoPostal").value;
        if (!estado.length)
            estado = template.find("#estado").value;
        var pais = null;
        var noFaltaPais = true;
        if (Session.get('extranjero')){
            pais = template.find('.pais').value;
            if (!pais.length){
                noFaltaPais = false;
            }
        }



        if (rfc.length &&
            razonSocial.length &&
            calle.length &&
            numExt.length &&
            //numInt.length &&
            colonia.length &&
            municipio.length &&
            estado.length &&
            codigoPostal.length &&
            noFaltaPais) {
            Meteor.call('cambiaDatosFiscales', {
                id: Session.get("selected_rfc"),
                rfc: rfc,
                razonSocial: razonSocial.replace(","," "),
                calle: calle.replace(","," "),
                numExt: numExt.replace(","," "),
                numInt: numInt.replace(","," "),
                colonia: colonia.replace(","," "),
                municipio: municipio.replace(","," "),
                estado: estado,
                codigoPostal: codigoPostal,
                pais: pais
            }, function (error, rfc) {
                if (! error) {
                    Session.set("selected", rfc);
                    Session.set("muestraCambiaDatosDialog", false);
                } else {
                    Session.set("createError",
                        "Error en datos:   "+ error.reason);
                    focusText(template.find("#rfc"));
                }
            });
        } else {
            Session.set("createError",
                "Faltan datos");
            focusText(template.find("#rfc"));
        }
    },

    'click .cancel': function () {
        Session.set("muestraCambiaDatosDialog", false);
    }
});

