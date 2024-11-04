/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, waitFor, fireEvent  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import * as encryptionUtils from './encryptionUtils';
import App from './App';
import { MyProvider } from './context/MyContext';
import CryptoJS from 'crypto-js';


//check si le add marche et renvoie le bon truc
//si le read marche 
//si le delete marche
//si le update marche
//si sendMail est appelée

test('présence éléments', () => {
  render(<App />);

  //Check si les éléments existent
  const TitreH1 = screen.getByTestId('input-title');
  const textarea = screen.getByTestId('textarea');
  const buttonSendMessage = screen.getByTestId('btn-send');

  expect(TitreH1).toBeInTheDocument();
  expect(textarea).toBeInTheDocument();
  expect(buttonSendMessage).toBeInTheDocument();
});


//USER ACTIONS

test('ajouter un message', async () => {
  // const user = userEvent.setup();
  const encryptTextSpy = jest.spyOn(encryptionUtils, 'encryptText');
  render(<App />)

  //pouvoir remplir le titre
  const inputTitle = screen.getByTestId('input-title');
  userEvent.type(screen.getByTestId('input-title'), 'Titre du message');
  expect(inputTitle).toHaveValue('Titre du message');

   //event écrire
    const textArea = screen.getByTestId('textarea');
   userEvent.type(textArea, 'Ceci est un message');
   expect(textArea).toHaveValue('Ceci est un message');

  //pouvoir cliquer sur le bouton envoyer/appelle fonction encrypter
  fireEvent.click(screen.getByTestId('btn-send'));
  expect(encryptTextSpy).toHaveBeenCalledWith('Ceci est un message', 'my-secret-key');
  
    //le titre s'ajoute bien à la liste
  const tbody = screen.getByTestId('tbody');
  const newMessageTitle = await screen.findByText('Titre du message');
  expect(newMessageTitle).toBeInTheDocument();

  //Vérifier si une tr a été ajoutée au tbody
  const encryptedMessageCell = tbody.querySelectorAll('tr')[0].querySelectorAll('td')[2];
  expect(encryptedMessageCell.textContent).not.toBe('');

    // clear le spy
    encryptTextSpy.mockRestore();

});

test('supprimer un message', async () => {
  const deleteMessageSpy = jest.spyOn(encryptionUtils, 'deleteMessage');
  render(<App />);

  fireEvent.click(screen.getByTestId('btn-send'));

  const tbody = screen.getByTestId('tbody');

  //vérifier si le bouton delete exist
  const btnDelete = await screen.findByText('Delete');   
  expect(btnDelete).toBeInTheDocument();

  //clic sur le bouton
  fireEvent.click(btnDelete);
  expect(deleteMessageSpy).toHaveBeenCalled();

  expect(btnDelete).not.toBeInTheDocument();

  // eslint-disable-next-line testing-library/no-node-access
  expect(tbody.querySelectorAll('tr').length).toBe(0);
});



test('modifier message', async () => {
  const encryptTextSpy = jest.spyOn(encryptionUtils, 'encryptText');
  render(<App />)

  //pouvoir remplir le titre
  const inputTitle = screen.getByTestId('input-title');
  userEvent.type(screen.getByTestId('input-title'), 'Titre du message');
  expect(inputTitle).toHaveValue('Titre du message');

   //event écrire
    const textArea = screen.getByTestId('textarea');
   userEvent.type(textArea, 'Ceci est un message');
  expect(textArea).toHaveValue('Ceci est un message');

  //pouvoir cliquer sur le bouton envoyer/appelle fonction encrypter
  fireEvent.click(screen.getByTestId('btn-send'));
  //RAF voir si la fonction encrypt a été appelée
  expect(encryptTextSpy).toHaveBeenCalledWith('Ceci est un message', 'my-secret-key');
  
    //le titre s'ajoute bien à la liste
  const tbody = screen.getByTestId('tbody');
  const newMessageTitle = await screen.findByText('Titre du message');
  expect(newMessageTitle).toBeInTheDocument();

  //Vérifier si une tr a été ajoutée au tbody
  const encryptedMessageCell = tbody.querySelectorAll('tr')[0].querySelectorAll('td')[2];
  expect(encryptedMessageCell.textContent).not.toBe('');

    // clea le spy
    encryptTextSpy.mockRestore();


  const btnUpdate = await screen.findByText('Modifier');
  expect(btnUpdate).toBeInTheDocument();
  fireEvent.click(btnUpdate);

  const popup = screen.getByTestId('popup');
  const secretKeyInput = screen.getByTestId('secret-key-input');
  const popupTitle = await screen.findByText('Enter Secret Key');

  expect(popup).toBeInTheDocument();
  expect(secretKeyInput).toBeInTheDocument();
  expect(popupTitle).toBeInTheDocument();

  userEvent.type(secretKeyInput, 'my-secret-key');
  expect(secretKeyInput).toHaveValue('my-secret-key');

  const decryptBtn = await screen.findByText('Decrypt');
  const cancelBtn = await screen.findByText('Cancel');

  expect(decryptBtn).toBeInTheDocument();
  expect(cancelBtn).toBeInTheDocument();

  fireEvent.click(decryptBtn);
  expect(popup).not.toBeInTheDocument();
  expect(secretKeyInput).not.toBeInTheDocument();
  expect(popupTitle).not.toBeInTheDocument();

  const updateTextarea = screen.getByTestId('update-textarea');
  expect(updateTextarea).toBeInTheDocument();

  userEvent.type(updateTextarea, ' modifié');
  expect(updateTextarea).toHaveValue('Ceci est un message modifié');

  const btnValidate = await screen.findByText('Valider');   
  expect(btnValidate).toBeInTheDocument();
  fireEvent.click(btnValidate);

  const ecryptedMessage = screen.getByTestId('encrypted-message');
  fireEvent.click(ecryptedMessage);

  const newpopup = screen.getByTestId('popup');
  expect(newpopup).toBeInTheDocument();

  const newSecretKeyInput = screen.getByTestId('secret-key-input');

  userEvent.type(newSecretKeyInput, 'my-secret-key');
  expect(newSecretKeyInput).toHaveValue('my-secret-key');

  fireEvent.click(decryptBtn);

  const decryptedMessage = screen.getByTestId('decrypted-message');
  expect(decryptedMessage).toBeInTheDocument();
});

test('cancel update', async () => {
  const encryptTextSpy = jest.spyOn(encryptionUtils, 'encryptText');
  render(<App />)

  //pouvoir remplir le titre
  const inputTitle = screen.getByTestId('input-title');
  userEvent.type(screen.getByTestId('input-title'), 'Titre du message');
  expect(inputTitle).toHaveValue('Titre du message');

   //event écrire
    const textArea = screen.getByTestId('textarea');
   userEvent.type(textArea, 'Ceci est un message');
   expect(textArea).toHaveValue('Ceci est un message');

  //pouvoir cliquer sur le bouton envoyer/appelle fonction encrypter
  fireEvent.click(screen.getByTestId('btn-send'));
  //RAF voir si la fonction encrypt a été appelée
  expect(encryptTextSpy).toHaveBeenCalledWith('Ceci est un message', 'my-secret-key');
  
    //le titre s'ajoute bien à la liste
  const tbody = screen.getByTestId('tbody');
  const newMessageTitle = await screen.findByText('Titre du message');
  expect(newMessageTitle).toBeInTheDocument();

  //Vérifier si une tr a été ajoutée au tbody
  const encryptedMessageCell = tbody.querySelectorAll('tr')[0].querySelectorAll('td')[2];
  expect(encryptedMessageCell.textContent).not.toBe('');

    // clea le spy
    encryptTextSpy.mockRestore();

  const btnUpdate = await screen.findByText('Modifier');
  expect(btnUpdate).toBeInTheDocument();

  //ouverture du popup puis fermeture 
  fireEvent.click(btnUpdate);
  const popup = screen.getByTestId('popup');
  expect(popup).toBeInTheDocument();

  const cancelBtn = await screen.findByText('Cancel');

  expect(cancelBtn).toBeInTheDocument();
  fireEvent.click(cancelBtn);
  expect(popup).not.toBeInTheDocument();
});