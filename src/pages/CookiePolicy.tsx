
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Cookies
          </h1>
          <p className="text-xl text-gray-600">
            Comment nous utilisons les cookies sur BimFun
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Qu'est-ce qu'un cookie ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous 
                visitez un site web. Les cookies nous permettent de reconnaître votre navigateur 
                et de capturer et retenir certaines informations pour améliorer votre expérience 
                sur notre plateforme.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de cookies que nous utilisons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies essentiels</h3>
                <p className="text-gray-600">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas 
                  être désactivés. Ils permettent notamment la navigation, l'authentification 
                  et la sécurité de votre session.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies de performance</h3>
                <p className="text-gray-600">
                  Ces cookies nous aident à comprendre comment les visiteurs interagissent 
                  avec notre site en collectant et rapportant des informations de manière anonyme. 
                  Cela nous permet d'améliorer continuellement notre plateforme.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies de fonctionnalité</h3>
                <p className="text-gray-600">
                  Ces cookies permettent au site de se souvenir des choix que vous faites 
                  (comme votre nom d'utilisateur, votre langue ou votre région) et fournissent 
                  des fonctionnalités améliorées et plus personnelles.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cookies de ciblage</h3>
                <p className="text-gray-600">
                  Ces cookies peuvent être définis via notre site par nos partenaires publicitaires. 
                  Ils peuvent être utilisés pour créer un profil de vos intérêts et vous montrer 
                  des annonces pertinentes sur d'autres sites.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Nous utilisons également des services tiers qui peuvent placer des cookies 
                sur votre appareil, notamment :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Services d'analyse (pour comprendre l'utilisation du site)</li>
                <li>Services de paiement (pour traiter les abonnements)</li>
                <li>Services de communication (pour le chat et les appels vidéo)</li>
                <li>Réseaux sociaux (pour le partage de contenu)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. 
                Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur 
                et paramétrer la plupart des navigateurs pour qu'ils les bloquent.
              </p>
              <p className="text-gray-600">
                Cependant, si vous faites cela, vous devrez peut-être ajuster manuellement 
                certaines préférences à chaque fois que vous visitez le site et certains 
                services et fonctionnalités pourraient ne pas fonctionner.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres du navigateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Pour gérer les cookies dans votre navigateur :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                <li><strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
                <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                <li><strong>Edge :</strong> Paramètres → Confidentialité → Cookies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Durée de conservation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Les cookies ont différentes durées de vie. Certains sont supprimés à la fin 
                de votre session de navigation (cookies de session), tandis que d'autres 
                restent sur votre appareil pour une période déterminée (cookies persistants). 
                Nous conservons les cookies uniquement le temps nécessaire aux fins pour 
                lesquelles ils ont été collectés.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mise à jour de cette politique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nous pouvons mettre à jour cette politique de cookies de temps en temps. 
                Nous vous encourageons à consulter régulièrement cette page pour rester 
                informé de la façon dont nous utilisons les cookies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Si vous avez des questions concernant notre utilisation des cookies, 
                veuillez nous contacter à : support@bimfun.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
