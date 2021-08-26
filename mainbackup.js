//Chamar o package webdriver
const { remote } = require('webdriverio');

//Variáveis para as credênciais da conta
const username = 'Ricardotorres1550'
const pass = 'nokia6600'

const termsAndConditions = '#page-privacynotice > div > div > div > div:nth-child(2) > div.privacynotice-container.row.overflow-visible > div:nth-child(2) > div > div > div'
const termsAndConditionsBtn = '#page-privacynotice > div > div > div > div.col-xs-12.horizontal-center.agree-button-container > button'
const keepLoggedIn = '#rememberme-label > span'
const loginUsername = '#manager-name'
const passInput = '#password'
const gotoLogin = '#login-link'
const signIn = '#login'
const endSeasonTicket = '#endofseasonreward-modal-content'
const walletBtn = '.wallet-amount' 
const walletContainer = '.products-container'
const adsIcon = '.watch-businessclub-video-btn'
const ePub = '#modal-dialog-alert'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function date() {
  return new Date().toISOString()
}

(async function mainPro () { 
  const browser = await remote({
    logLevel: 'silent',
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': { 
        args: [/*'--headless',*/ '--disable-gpu','--window-size=1440,735']
      }
    }
  })

  await browser.url('https://en.onlinesoccermanager.com/Login')
  await acceptTermsAndConditions(browser)
  await login(browser)
  
  while(true) {
    try {
      await browser.url('https://en.onlinesoccermanager.com/Dashboard')
      const walletBar = await browser.$(walletBtn)
      const walletCt = await browser.$(walletContainer)
      const adsIconBtn = await browser.$(adsIcon)
      const endPub = await browser.$(ePub)
      console.log(date(), 'Opening wallet')
        await walletBar.waitForClickable({timeout: 30000});
        await walletBar.click()
        await sleep(2000)
        //////////////////
      console.log(date(), 'Trying to watch ad')
        await walletCt.waitForDisplayed({timeout: 30000});
        await adsIconBtn.waitForClickable({timeout: 30000});
        adsIconBtn.click();
        await sleep(5000)
        if(await endPub.isDisplayed()){
            console.log('reached limit')
            setTimeout(mainPro, 3650000)
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
  await browser.deleteSession()
})().catch((e) => console.error(e))


async function acceptTermsAndConditions(browser) {
  console.log(date(), 'Accepting Terms and Conditions')
  try {
    const termsAndConditionsEl = await browser.$(termsAndConditions)
    const termsAndConditionsBtnEl = await browser.$(termsAndConditionsBtn)

    await termsAndConditionsEl.waitForDisplayed({ timeout: 20000 });
    await termsAndConditionsEl.click()

    await termsAndConditionsBtnEl.waitForClickable({ timeout: 20000 });
    await termsAndConditionsBtnEl.click()

    const gotoLoginEl = await browser.$(gotoLogin)
    await gotoLoginEl.waitForClickable({ timeout: 25000 });
    await gotoLoginEl.click()

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
    const ticketWinner = '.btn-new'
  await sleep(5000)
    if(await endSeasonT.isDisplayed()){
      console.log(date(), 'Avoiding End Season Ticket!')
      const endSeason = await browser.$(ticketWinner)
      await endSeason.waitForClickable({timeout: 4000});
      await endSeason.click();
      console.log(date(), 'End Season avoided!')
    }

}