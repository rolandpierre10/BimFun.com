
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-xl text-gray-600">
            Informations légales concernant BimFun
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">BimFun</h3>
                <p className="text-gray-600">
                  Plateforme sociale professionnelle<br />
                  Montréal, QC, Canada<br />
                  Email: support@bimfun.com
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ce site est hébergé par des services cloud sécurisés avec une infrastructure 
                distribuée pour garantir la disponibilité et la sécurité de vos données.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) 
                est protégé par les droits d'auteur et reste la propriété exclusive de BimFun 
                ou de ses partenaires.
              </p>
              <p className="text-gray-600">
                Toute reproduction, représentation, modification, publication ou transmission 
                de ces éléments est strictement interdite sans autorisation écrite préalable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                BimFun s'efforce de fournir des informations aussi précises que possible. 
                Cependant, nous ne pouvons garantir l'exactitude, la complétude ou 
                l'actualité des informations diffusées sur le site.
              </p>
              <p className="text-gray-600">
                L'utilisateur utilise ces informations sous sa propre responsabilité et 
                à ses propres risques. BimFun ne pourra être tenu responsable des dommages 
                directs ou indirects pouvant résulter de l'utilisation du site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Protection des données personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Conformément aux réglementations en vigueur sur la protection des données, 
                notamment le RGPD, nous nous engageons à protéger la confidentialité et 
                la sécurité de vos données personnelles.
              </p>
              <p className="text-gray-600">
                Pour plus d'informations sur le traitement de vos données, 
                consultez notre Politique de Confidentialité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Droit applicable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les présentes mentions légales sont régies par le droit canadien. 
                En cas de litige, les tribunaux canadiens seront seuls compétents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Pour toute question concernant ces mentions légales, 
                vous pouvez nous contacter à l'adresse : support@bimfun.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
