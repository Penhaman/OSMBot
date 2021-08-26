//Chamar o package webdriver
const {remote} = require('webdriverio');

//Variáveis para as credênciais da conta
const username = 'Penhaman'
const pass = '#testedesom#'

const gLog = "#page-signup > div.page.content.hidden-before-binding > div.register-information-container.horizontal-center-absolute > div:nth-child(2) > button"
const permAds = "#page-privacynotice > div > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button > span"
const skipReg = '#page-signup > div.page.content.hidden-before-binding > div.register-information-container.horizontal-center-absolute > div:nth-child(2) > button'
const wallet = 'btn-alternative'
const termsAndConditions = '#page-privacynotice > div > div > div > div:nth-child(2) > div.privacynotice-container.row.overflow-visible > div:nth-child(2) > div > div > div'
const termsAndConditionsBtn = '#page-privacynotice > div > div > div > div.col-xs-12.horizontal-center.agree-button-container > button'
//const keepLoggedIn = '#rememberme-label > span'
const loginUsername = '#manager-name'
const passInput = '#password'
//const gotoLogin = '#login-link'
const signIn = '#login'
const endSeasonTicket = '#endofseasonreward-modal-content'
const walletBtn = '#balances > div > div.wallet-amount.pull-left.center' 
const walletContainer = '.products-container'
const adsIcon = '#product-category-free > div.products-section-body.products-small-container > div'
const ePub = '#modal-dialog-alert'
const ePub2 = '#modal-dialog-alert'
//const dropList = '#desktop-menu-navbar > li:nth-child(5) > a > div.menu-title'
//const club = '#desktop-menu-navbar > li.dropdown.border.open > ul > li:nth-child(4) > a'
const clubAd = '#body-content > div.row.row-h-sm-600.row-h-md-23.overflow-hidden.theme-stepover-0.businessclub-container > div.col-xs-12.col-h-xs-22.col-h-sm-20.businessclub-rows-container > div > div:nth-child(1) > div > div > div > div.col-xs-12.col-h-xs-17.business-club-image-container > div > div > div'
//const btnOK = '#modal-dialog-alert > div.row.row-h-xs-24.overflow-visible.modal-content-container > div > div > div > div.modal-footer > div > div > div'
//const fechar = '#modal-dialog-bosscoinshop > div.close-button-container > button > span'
//const teamBtn = '#mainAccount > div > div.row.row-h-xs-24.center.overflow-visible > div'


//Função para dar tempo de espera
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Função para receber data e hora para os logs.
function date() {
  return new Date().toISOString()
}

//Função principal
async function mainPro () { 
  const browser = await remote({
    logLevel: 'silent',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': { 
        args: ['--headless','--disable-gpu','--window-size=1440,735']
      }
    }
  })

  await browser.url('https://en.onlinesoccermanager.com/Login')
  await acceptTermsAndConditions(browser)
  await login(browser)
  
  while(true) {
    try {
      await browser.url('https://en.onlinesoccermanager.com/Career')
      const walletBar = await browser.$(walletBtn)
      const walletCt = await browser.$(walletContainer)
      const adsIconBtn = await browser.$(adsIcon)
      const endPub = await browser.$(ePub)
      console.log(date(), 'Opening wallet')
        await walletBar.waitForClickable({timeout: 10000});
        await walletBar.click()
        await sleep(2000)
        //////////////////
      console.log(date(), 'Trying to watch ad')
        await walletCt.waitForDisplayed({timeout: 30000});
        await adsIconBtn.waitForClickable({timeout: 30000});
        adsIconBtn.click();
        await sleep(5000)
        if(await endPub.isDisplayed()){
            console.log(date(), 'reached limit on main')
            console.log(date(), 'going to Business Club')
            await bizClub(browser);
            break;
        } else {
      console.log(date(), 'Going to watch an ad')
        await sleep(60000)
      console.log(date(), 'Ad gone!')
      ///////////////////////
     ///////////////////////////////
      }
    } catch(e) {
      console.log(date(), 'Error happened:', e)
    }
  }
 
} mainPro()

async function bizClub(browser){
  while(true){
    try{
      await browser.url('https://en.onlinesoccermanager.com/BusinessClub')
      const endPub2 = await browser.$(ePub2)
      console.log(date(), 'Now on Business Club!')
      const clubAdBtn = await browser.$(clubAd)
      await clubAdBtn.waitForClickable({timeout: 15000});
      clubAdBtn.click();
      await sleep(5000)
      if(await endPub2.isDisplayed()){
        console.log(date(), 'reached limit on Business Club')
        setTimeout(mainPro, 3650000)
        break;
      } else {
      console.log(date(), 'Going to watch BClub ad')
      await sleep(50000)
      console.log(date(), 'BC Ad gone!')
      }
      }catch(e) {
       console.log(date(), 'Error happened:', e)
    }
  }
    await browser.deleteSession()
}

async function acceptTermsAndConditions(browser) {
  console.log(date(), 'Accepting Terms and Conditions')
  try {
    const adsPerm = await browser.$(permAds)
    const termsAndConditionsEl = await browser.$(termsAndConditions)
    const termsAndConditionsBtnEl = await browser.$(termsAndConditionsBtn)
    const logG = await browser.$(gLog)

    await adsPerm.waitForClickable({timeout: 20000});
    await adsPerm.click()

    await logG.waitForClickable({timeout: 20000});
    await logG.click()

    await termsAndConditionsEl.waitForDisplayed({ timeout: 20000 });
    await termsAndConditionsEl.click()

    await termsAndConditionsBtnEl.waitForClickable({ timeout: 20000 });
    await termsAndConditionsBtnEl.click()

    const gotoLoginEl = await browser.$(skipReg)
    await gotoLoginEl.waitForClickable({ timeout: 25000 });
    await gotoLoginEl.click()

    await browser.url('https://en.onlinesoccermanager.com/Login')
    console.log(date(), 'Terms and Conditions Accepted')

  } catch(e) {
    const loginUserNameEl = await browser.$(loginUsername)
    const walletEl = await browser.$(wallet)

    if(await loginUserNameEl.isDisplayed()) {
      console.log(date(), 'Already accepted terms and contidions')
      return
    } else if (await walletEl.isDisplayed()) {
      console.log(date(), 'Already logged in')
      return
    }
    console.log(date(), 'Error accepting terms and conditions')
  }

}

async function login(browser) {
  console.log(date(), 'Trying to login')
    //espera pelo elemento com o id de login que é retornado pelo browser
    const loginUserIn = await browser.$(loginUsername)
    //define o campo de texto com o username
    await loginUserIn.waitForDisplayed({timeout: 4000});
    await loginUserIn.setValue(username)
    const passIn = await browser.$(passInput)
    await passIn.waitForDisplayed({timeout: 4000});
    await passIn.setValue(pass)

    const goSign = await browser.$(signIn)
    await goSign.waitForClickable({timeout: 3000});
    await goSign.click()
    const endSeasonT = await browser.$(endSeasonTicket)
    const ticketWinner = '#endofseasonreward-modal-content > div > div.col-xs-12.col-h-xs-24 > div:nth-child(3) > button'
    await sleep(20000)
    if( await endSeasonT.isDisplayed()){
      console.log(date(), 'Avoiding End Season Ticket!')
      const endSeason = await browser.$(ticketWinner)
      await endSeason.waitForClickable({timeout: 5000});
      await endSeason.click();
      console.log(date(), 'End Season avoided!')
    }
    await sleep(15000)
    if( await endSeasonT.isDisplayed()){
      console.log(date(), 'Avoiding End Season Ticket!')
      const endSeason1 = await browser.$(ticketWinner)
      await endSeason1.waitForClickable({timeout: 5000});
      await endSeason1.click();
      console.log(date(), 'End Season 2 avoided!')
    }
   

    
  

}