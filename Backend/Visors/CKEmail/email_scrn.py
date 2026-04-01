import email
import os
from email import policy
import playwright.sync_api



#Parses the eml and writes a temp html file for it s
def parse_eml_to_html(eml_path, html_path):
    with open(eml_path, 'rb') as f:
        msg = email.message_from_binary_file(f, policy=policy.default)
    
    html_body = ""
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/html':
                html_body = part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8')
    else:
        # Fallback for non-multipart emails
        if msg.get_content_type() == 'text/html':
             html_body = msg.get_payload(decode=True).decode(msg.get_content_charset() or 'utf-8')


    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_body)

#Screenshots via playwright
def take_screenshot(html_path, output_png):
    with playwright.sync_api.sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.set_viewport_size({"width": 800, "height": 2000})
        page.goto(f'file:///{html_path}')
        
        # Take screenshot
        page.screenshot(path=output_png, full_page=True)
        browser.close()

        return output_png
        