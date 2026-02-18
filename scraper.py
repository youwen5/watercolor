#!/usr/bin/env python3
"""
Watercolor - Tsinghua University course catalog scraper

Flow:
1. Opens a Firefox window
2. You navigate to the course catalog page and authenticate manually
3. Touch the file "ready" in this directory to signal scraping should begin
4. The scraper extracts all courses across all pages and saves to JSON/CSV
"""

import csv
import json
import os
import re
import shutil
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SIGNAL_FILE = Path("ready")
QUIT_FILE = Path("quit")

COLUMNS = [
    "title_en",
    "title_zh",
    "course_number",
    "course_sequence",
    "credit",
    "department",
    "instructor",
    "class_time",
    "course_features",
    "remarks",
]


def create_driver():
    """Create Firefox driver with a fresh profile."""
    options = Options()

    geckodriver_path = shutil.which("geckodriver")
    firefox_path = shutil.which("firefox")

    if geckodriver_path:
        print(f"Using geckodriver: {geckodriver_path}")
    if firefox_path:
        print(f"Using Firefox: {firefox_path}")
        options.binary_location = firefox_path

    service = Service(executable_path=geckodriver_path)
    driver = webdriver.Firefox(service=service, options=options)
    return driver


def wait_for_signal():
    """Wait for the user to create the signal file."""
    print(f"Waiting for signal file: {SIGNAL_FILE.resolve()}")
    print(f"  Run: touch {SIGNAL_FILE}")
    while not SIGNAL_FILE.exists():
        if QUIT_FILE.exists():
            QUIT_FILE.unlink()
            return False
        time.sleep(1)
    SIGNAL_FILE.unlink()
    print("Signal received!")
    return True


def find_course_tab(driver):
    """List all open tabs and switch to the one with course content."""
    handles = driver.window_handles
    print(f"\nOpen tabs: {len(handles)}")
    course_handle = None
    for i, handle in enumerate(handles):
        driver.switch_to.window(handle)
        title = driver.title
        url = driver.current_url
        marker = ""
        if (
            "xkJxs" in url
            or "xkBs" in url
            or ("77726476706e" in url and "timeout" not in url)
        ):
            marker = " <-- COURSES"
            course_handle = handle
        print(f"  [{i}] {title[:60]} | {url[:100]}{marker}")
    if course_handle:
        driver.switch_to.window(course_handle)
        print(f"\nSwitched to course tab.")
    else:
        print("\nNo course tab detected automatically. Using current tab.")
    return course_handle is not None


def switch_to_course_iframe(driver):
    """Switch into the course data iframe (iframe[1], name='right')."""
    driver.switch_to.default_content()
    iframes = driver.find_elements(By.TAG_NAME, "iframe")
    if len(iframes) >= 2:
        driver.switch_to.frame(iframes[1])
        return True
    elif len(iframes) == 1:
        driver.switch_to.frame(iframes[0])
        return True
    # No iframes - content may be directly in page
    return False


def get_pagination_info(driver):
    """Extract current page and total pages from the pagination text."""
    try:
        page_source = driver.page_source
        match = re.search(
            r"Page\s+(\d+)\s*/\s*Total\s+(\d+)\s+page.*?(\d[\d,]*)\s+records",
            page_source,
        )
        if match:
            current = int(match.group(1))
            total_pages = int(match.group(2))
            total_records = int(match.group(3).replace(",", ""))
            return current, total_pages, total_records
    except Exception as e:
        print(f"  Warning: Could not parse pagination: {e}")
    return None, None, None


def extract_page_courses(driver):
    """Extract course data from the currently loaded page via rendered datagrid."""
    courses = []
    rows = driver.find_elements(By.CSS_SELECTOR, "tr.datagrid-row")
    for row in rows:
        cells = row.find_elements(By.CSS_SELECTOR, "td div.datagrid-cell")
        if len(cells) < len(COLUMNS):
            continue
        course = {}
        for i, col in enumerate(COLUMNS):
            cell = cells[i]
            if col == "title_zh":
                # Extract Chinese title from the link text
                links = cell.find_elements(By.TAG_NAME, "a")
                course[col] = links[0].text.strip() if links else cell.text.strip()
            elif col == "instructor":
                # May have multiple instructor links
                links = cell.find_elements(By.TAG_NAME, "a")
                if links:
                    course[col] = ", ".join(
                        link.text.strip() for link in links if link.text.strip()
                    )
                else:
                    course[col] = cell.text.strip()
            else:
                course[col] = cell.text.strip()
        courses.append(course)
    return courses


def navigate_to_page(driver, page_num):
    """Navigate to a specific page by submitting the form."""
    try:
        driver.execute_script(
            f"document.frm.page.value = '{page_num}'; document.frm.submit();"
        )
        return True
    except Exception as e:
        print(f"  Error navigating to page {page_num}: {e}")
        return False


def wait_for_page_load(driver, expected_page, timeout=15):
    """Wait until the page content updates to the expected page number."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            current, _, _ = get_pagination_info(driver)
            if current == expected_page:
                return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def save_courses(all_courses, fmt="both"):
    """Save courses to JSON and/or CSV."""
    if fmt in ("json", "both"):
        with open("courses.json", "w", encoding="utf-8") as f:
            json.dump(all_courses, f, ensure_ascii=False, indent=2)
        print(f"Saved {len(all_courses)} courses to courses.json")

    if fmt in ("csv", "both"):
        with open("courses.csv", "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=COLUMNS)
            writer.writeheader()
            writer.writerows(all_courses)
        print(f"Saved {len(all_courses)} courses to courses.csv")


def scrape_all_pages(driver):
    """Scrape all pages of the course catalog."""
    find_course_tab(driver)
    switch_to_course_iframe(driver)

    current_page, total_pages, total_records = get_pagination_info(driver)
    if total_pages is None:
        print("Could not determine pagination. Scraping visible page only.")
        total_pages = 1
        current_page = 1
    else:
        print(
            f"\nPagination: page {current_page}/{total_pages} ({total_records} records)"
        )

    all_courses = []

    # If we're not on page 1, navigate there first
    if current_page != 1:
        print("Navigating to page 1...")
        navigate_to_page(driver, 1)
        if not wait_for_page_load(driver, 1):
            print("Warning: Could not confirm page 1 loaded, continuing anyway.")

    for page in range(1, total_pages + 1):
        if page > 1:
            navigate_to_page(driver, page)
            # After form submit, we need to re-enter the iframe
            time.sleep(1)
            switch_to_course_iframe(driver)
            if not wait_for_page_load(driver, page, timeout=20):
                print(f"  Warning: Page {page} may not have loaded correctly.")

        courses = extract_page_courses(driver)
        all_courses.extend(courses)
        print(f"  Page {page}/{total_pages}: {len(courses)} courses (total: {len(all_courses)})")

        # Save progress every 10 pages
        if page % 10 == 0:
            save_courses(all_courses)

    return all_courses


def main():
    print("=" * 60)
    print("Watercolor - Tsinghua Course Catalog Scraper")
    print("=" * 60)
    print()

    # Clean up stale signal files
    if SIGNAL_FILE.exists():
        SIGNAL_FILE.unlink()
    if QUIT_FILE.exists():
        QUIT_FILE.unlink()

    driver = create_driver()

    try:
        print("Firefox is open. Please:")
        print("  1. Navigate to the course catalog page")
        print("  2. Authenticate as needed")
        print(f"  3. Run: touch {SIGNAL_FILE}")
        print()

        if not wait_for_signal():
            print("Quit signal received.")
            return

        time.sleep(2)

        try:
            _ = driver.title
        except Exception:
            print("ERROR: Browser window was closed before scraping could begin.")
            return

        all_courses = scrape_all_pages(driver)
        save_courses(all_courses)

        print(f"\nDone! Scraped {len(all_courses)} courses total.")
        print("Press Ctrl+C or run: touch quit")

        # Keep browser open for inspection
        while True:
            if QUIT_FILE.exists():
                QUIT_FILE.unlink()
                break
            if SIGNAL_FILE.exists():
                SIGNAL_FILE.unlink()
                print("\n--- Re-scraping ---")
                all_courses = scrape_all_pages(driver)
                save_courses(all_courses)
                print(f"\nDone! Scraped {len(all_courses)} courses total.")
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nInterrupted by user.")
    finally:
        driver.quit()
        print("Browser closed.")


if __name__ == "__main__":
    main()
