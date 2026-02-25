#!/usr/bin/env python3
"""
Wrap long lines in markdown files to comply with line length limits.

This script wraps lines that exceed a specified length (default 120 characters)
while preserving markdown formatting, lists, links, and code blocks.

Links are never broken - if a link would be split, the entire link is moved to
a new line.

Usage:
    python3 wrap_markdown_lines.py <file1.md> [file2.md ...]
    python3 wrap_markdown_lines.py --max-length 100 <file.md>
"""

import sys
import re
import argparse
from pathlib import Path


def is_in_code_block(lines, index):
    """Check if line at index is inside a code block."""
    code_block_count = 0
    for i in range(index):
        if lines[i].strip().startswith('```'):
            code_block_count += 1
    return code_block_count % 2 == 1


def is_table_line(line):
    """Check if line is part of a markdown table."""
    stripped = line.strip()
    # Table lines have pipes and typically start/end with pipe or have multiple pipes
    return '|' in stripped and (stripped.count('|') > 1 or stripped.startswith('|'))


def is_heading(line):
    """Check if line is a markdown heading."""
    return line.strip().startswith('#')


def get_list_indent(line):
    """Get indentation for a list item."""
    match = re.match(r'^(\s*)([-*+]|\d+\.)\s+', line)
    if match:
        # Return spaces equal to the full match length for continuation
        return ' ' * len(match.group(0))
    return None


def find_markdown_links(text):
    """
    Find all markdown links in text and return their positions.
    Returns list of (start, end, link_text) tuples for [text](url) style links.
    """
    links = []
    # Match [text](url) style links
    for match in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', text):
        links.append((match.start(), match.end(), match.group(0)))
    return links


def find_wrap_point(text, max_len):
    """
    Find the best point to wrap text, preferring spaces.
    Never breaks inside a markdown link - if we'd break a link, we move the whole link to next line.
    """
    if len(text) <= max_len:
        return -1

    # Find all links in the text
    links = find_markdown_links(text)

    # Find last space before max_len
    for i in range(max_len, 0, -1):
        if text[i] == ' ':
            # Check if this position is inside a link
            inside_link = False
            for link_start, link_end, _ in links:
                if link_start < i < link_end:
                    # This would break a link - instead, wrap before the link starts
                    # Find the space before the link
                    for j in range(link_start - 1, -1, -1):
                        if text[j] == ' ':
                            return j
                    # No space before link, can't wrap nicely
                    return -1
                    inside_link = True
                    break

            if inside_link:
                continue

            # Check if we're not breaking inline code
            backtick_count = text[:i].count('`')
            if backtick_count % 2 == 1:  # Odd number means we're inside code
                continue

            return i

    # No good break point found
    return -1


def wrap_line(line, max_length=120):
    """
    Wrap a single line to max_length, preserving markdown structure.
    Returns a list of wrapped lines.
    """
    if len(line.rstrip()) <= max_length:
        return [line]

    # Check if it's a list item
    list_indent = get_list_indent(line)

    # Strip trailing newline for processing
    text = line.rstrip('\n')
    wrapped_lines = []

    if list_indent:
        # For list items, preserve the marker on first line
        # Get the part after the list marker
        match = re.match(r'^(\s*(?:[-*+]|\d+\.)\s+)', text)
        prefix = match.group(1)
        content = text[len(prefix):]

        # Wrap the content
        current = prefix + content
        first_line = True
        max_iterations = 1000  # Safety limit to prevent infinite loops
        iteration = 0
        while len(current) > max_length and iteration < max_iterations:
            iteration += 1
            prev_len = len(current)
            wrap_point = find_wrap_point(current, max_length)
            if wrap_point <= 0:
                # Can't wrap nicely, keep as is
                wrapped_lines.append(current)
                break

            wrapped_lines.append(current[:wrap_point])
            # Continue with proper indentation
            remainder = current[wrap_point:].lstrip()
            current = list_indent + remainder if remainder else ''

            # Safety check: ensure we're making progress
            if len(current) >= prev_len:
                # Not making progress, line can't be wrapped further
                if current:
                    wrapped_lines.append(current)
                break
            first_line = False
        else:
            if current:  # Add remaining text if any
                wrapped_lines.append(current)
    else:
        # Regular paragraph text
        current = text
        max_iterations = 1000  # Safety limit to prevent infinite loops
        iteration = 0
        while len(current) > max_length and iteration < max_iterations:
            iteration += 1
            prev_len = len(current)
            wrap_point = find_wrap_point(current, max_length)
            if wrap_point <= 0:
                # Can't wrap nicely, keep as is
                wrapped_lines.append(current)
                break

            wrapped_lines.append(current[:wrap_point])
            remainder = current[wrap_point:].lstrip()
            current = remainder if remainder else ''

            # Safety check: ensure we're making progress
            if current and len(current) >= prev_len:
                # Not making progress, line can't be wrapped further
                wrapped_lines.append(current)
                break
        else:
            if current:  # Add remaining text if any
                wrapped_lines.append(current)

    # Add newlines back
    return [l + '\n' for l in wrapped_lines]


def process_markdown_file(filepath, max_length=120, dry_run=False):
    """
    Process a markdown file to wrap long lines.

    Args:
        filepath: Path to the markdown file
        max_length: Maximum line length (default 120)
        dry_run: If True, don't write changes, just report

    Returns:
        Number of lines wrapped
    """
    filepath = Path(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    lines_wrapped = 0

    for i, line in enumerate(lines):
        # Skip code blocks
        if is_in_code_block(lines, i):
            new_lines.append(line)
            continue

        # Skip table lines
        if is_table_line(line):
            new_lines.append(line)
            continue

        # Skip headings
        if is_heading(line):
            new_lines.append(line)
            continue

        # Check if line needs wrapping
        if len(line.rstrip()) > max_length:
            wrapped = wrap_line(line, max_length)
            new_lines.extend(wrapped)
            if len(wrapped) > 1:
                lines_wrapped += 1
        else:
            new_lines.append(line)

    if not dry_run and lines_wrapped > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

    return lines_wrapped


def main():
    parser = argparse.ArgumentParser(
        description='Wrap long lines in markdown files to comply with line length limits.'
    )
    parser.add_argument(
        'files',
        nargs='+',
        help='Markdown files to process'
    )
    parser.add_argument(
        '--max-length',
        type=int,
        default=120,
        help='Maximum line length (default: 120)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without making changes'
    )

    args = parser.parse_args()

    total_wrapped = 0
    for filepath in args.files:
        if not Path(filepath).exists():
            print(f"Warning: {filepath} not found, skipping", file=sys.stderr)
            continue

        wrapped = process_markdown_file(filepath, args.max_length, args.dry_run)
        if wrapped > 0:
            action = "Would wrap" if args.dry_run else "Wrapped"
            print(f"{action} {wrapped} line(s) in {filepath}")
        total_wrapped += wrapped

    if total_wrapped > 0:
        action = "would be" if args.dry_run else "were"
        print(f"\nTotal: {total_wrapped} line(s) {action} wrapped")
    else:
        print("No lines needed wrapping")

    return 0 if total_wrapped >= 0 else 1


if __name__ == '__main__':
    sys.exit(main())
