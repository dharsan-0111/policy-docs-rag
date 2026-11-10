# Acme Corp IT: VPN and Laptop Setup Guide

Welcome to Acme Corp! This guide details the mandatory setup process for your new company-issued hardware and secure network access. Strict adherence to these protocols ensures compliance with our ISO-27001 security standards.

## 1. Hardware Overview

Depending on your role, you have been issued one of two standard devices:
*   **AcmeBook Pro (Standard):** 14-inch display, 32GB RAM, 1TB encrypted SSD. (Issued to Engineering, Marketing, Finance, HR).
*   **AcmePad (Field):** 11-inch tablet with detachable keyboard, 16GB RAM, cellular-enabled. (Issued to Field Sales and Logistics only).

*Note: All devices come pre-configured with AcmeSecure Drive Encryption. Do not attempt to bypass the pre-boot authentication.*

## 2. Initial Device Boot and Login

1.  **Power On:** Press the power button. Ensure the device is plugged into the provided 65W charger during initial setup.
2.  **Pre-Boot Authentication:** You will be prompted for an initial unlock PIN. This 6-digit PIN was sent to your personal email address (the one used during recruitment) with the subject line `[Acme IT] Your Initial Device PIN`.
3.  **Windows/macOS Login:** Once past the boot screen, connect to a secure Wi-Fi network. 
4.  **First-Time Login:** Enter your formal company email (`firstname.lastname@acme.corp`). 
5.  **Temporary Password:** Enter the temporary password provided by your manager on your first day.
6.  **Password Reset:** You will be immediately forced to change this password.
    *   *Requirements:* Minimum 14 characters, at least one uppercase, one lowercase, one number, and one special character. Passwords must be rotated every 90 days.

## 3. Multi-Factor Authentication (MFA) Setup

Acme Corp utilizes a proprietary MFA application called **AcmeAuth**. Third-party authenticators (like Google Authenticator or Authy) are strictly prohibited.

1.  On your corporate mobile device (or personal device if enrolled in BYOD), navigate to your respective app store.
2.  Search for and download **AcmeAuth** (Publisher: Acme Corp IT Services).
3.  Open the application and tap "Scan QR Code".
4.  On your laptop, open the Edge or Chrome browser and navigate to `myaccount.acme.corp/mfa-setup`.
5.  Log in with your new password. A unique QR code will be displayed.
6.  Scan the QR code with the AcmeAuth app.
7.  The app will generate a 6-digit token. Enter this token on your laptop screen to verify the pairing.
8.  Save the 10 backup codes displayed on your screen in a secure location (e.g., your company-provided 1Password vault).

## 4. Connecting to the AcmeConnect VPN

To access internal resources (file shares, staging environments, intranet), you must be connected to the VPN.

### 4.1 Client Installation (If not pre-installed)
Your device should have the VPN client pre-installed. If it is missing, open the **Acme Software Center** app on your desktop and click "Install" next to **AcmeConnect VPN v4.2.1**. (Do not install v3.x, as it is deprecated).

### 4.2 Connecting
1.  Open the **AcmeConnect VPN** application from your system tray or menu bar.
2.  In the "Server Address" field, enter exactly: `us-east.vpn.acme.corp` (or `eu-west.vpn.acme.corp` if you are based in EMEA).
3.  Click "Connect".
4.  A browser window will pop up prompting you for your Acme credentials.
5.  Enter your email and password.
6.  An AcmeAuth push notification will be sent to your phone. Tap "Approve".
7.  The VPN icon in your tray will turn green, indicating a successful connection.

*Security Note: VPN sessions automatically terminate after 12 hours. You must reconnect daily.*

## 5. Mapping Network Drives

Once connected to the VPN, you must map your department's specific file share.

**For Windows (AcmeBook Pro):**
1.  Open File Explorer.
2.  Click on "This PC".
3.  Click the three dots at the top and select "Map network drive".
4.  Select drive letter `S:`.
5.  In the Folder box, type: `\\fileshare.acme.corp\[YOUR_DEPT_CODE]` (e.g., `\\fileshare.acme.corp\marketing`).
6.  Ensure "Reconnect at sign-in" is checked.
7.  Click Finish.

## 6. Device Security Policies

*   **Screen Lock:** Your screen is configured to lock automatically after 15 minutes of inactivity. Pressing `Win + L` (Windows) or `Ctrl + Cmd + Q` (Mac) when stepping away is mandatory.
*   **Software Installation:** You do not have local administrator rights. All approved software must be downloaded via the Acme Software Center.

## 7. IT Support

If you encounter errors during setup (e.g., "Error 403: Invalid Certificate" on the VPN), do not attempt to troubleshoot system files.
*   **Phone:** Call the IT Helpdesk at extension **4455** (or +1-800-555-4455 from a non-company phone).
*   **Portal:** Submit a ticket at `help.acme.corp`.
*   **Hours:** Support is available 24/5 (Monday 12:00 AM EST to Friday 11:59 PM EST).