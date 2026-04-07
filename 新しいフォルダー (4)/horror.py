import pygame
import sys
import random
import json
import os
import string

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("ダレト誰")

# 状態管理
game_state = "title"  # "title", "name_input", "loading", "playing", "ending"
selected_option = 0
player_name = ""
name_input_active = False
name_cursor_visible = True
name_cursor_timer = 0
save_count = 0
current_floor = 0
current_room = 0
inventory = []
hallucination_flags = {"A": False, "B": False, "C": False}
hallucination_active = False
hallucination_timer = 0
ending_chosen = False
red_glow_triggered = False

# 記録データ
note_data = {
    0: {"text": "【記録1】…", "read": False},
    1: {"text": "【記録2】…", "read": False},
    2: {"text": "【記録3】…", "read": False},
    # 必要に応じて追加
}

# フォント
font = pygame.font.SysFont("serif", 28)
title_font = pygame.font.SysFont("serif", 64)

# タイトル背景
title_bg = pygame.image.load("images/mansion_title.png")
title_bg = pygame.transform.scale(title_bg, (WIDTH, HEIGHT))
def draw_loading_screen():
    screen.fill((0, 0, 0))
    loading_text = font.render("記憶を呼び起こしています…", True, (180, 0, 0))
    screen.blit(loading_text, (WIDTH//2 - loading_text.get_width()//2, HEIGHT//2))
    pygame.display.flip()
    pygame.time.wait(2000)
    start_game()

def start_game():
    global game_state
    if not player_name:
        load_saved_game()
    show_message(f"{player_name} の記憶が、目を覚ます…")
    game_state = "playing"
def save_game():
    global save_count
    save_count += 1
    save_data = {
        "player_name": player_name,
        "floor": current_floor,
        "room": current_room,
        "inventory": inventory,
        "notes_read": {str(k): v["read"] for k, v in note_data.items()},
        "save_count": save_count,
        "hallucinations": hallucination_flags
    }
    with open("savefile.txt", "w", encoding="utf-8") as f:
        json.dump(save_data, f, ensure_ascii=False, indent=2)
    trigger_save_effect(save_count)

def load_saved_game():
    global player_name, current_floor, current_room, inventory, note_data, save_count, hallucination_flags
    try:
        with open("savefile.txt", "r", encoding="utf-8") as f:
            save_data = json.load(f)
            player_name = save_data.get("player_name", "？？？")
            current_floor = save_data.get("floor", 0)
            current_room = save_data.get("room", 0)
            inventory = save_data.get("inventory", [])
            notes_read = save_data.get("notes_read", {})
            save_count = save_data.get("save_count", 0)
            hallucination_flags = save_data.get("hallucinations", hallucination_flags)
            for k, read_flag in notes_read.items():
                if int(k) in note_data:
                    note_data[int(k)]["read"] = read_flag
    except Exception as e:
        show_message("セーブデータの読み込みに失敗しました。")
        print(e)
def trigger_save_effect(count):
    screen.fill((0, 0, 0))
    lines = [
        f"【記録{count}】",
        f"{player_name} の記憶を封じました。",
        "……",
        "また、ここから始められます。"
    ]
    for i, line in enumerate(lines):
        rendered = font.render(line, True, (200, 200, 200))
        screen.blit(rendered, (WIDTH//2 - rendered.get_width()//2, HEIGHT//2 - 40 + i * 30))
        pygame.display.flip()
        pygame.time.wait(600)
def trigger_hallucination(type_id):
    global hallucination_active, hallucination_timer
    hallucination_flags[type_id] = True
    hallucination_active = True
    hallucination_timer = 300  # 約5秒間
    # 幻覚音などを再生してもOK
def update_hallucination():
    global hallucination_active, hallucination_timer
    if hallucination_active:
        hallucination_timer -= 1
        if hallucination_timer <= 0:
            hallucination_active = False
def wrap_text(text, font, max_width):
    words = text.split(" ")
    lines = []
    current_line = ""
    for word in words:
        test_line = current_line + word + " "
        if font.size(test_line)[0] <= max_width:
            current_line = test_line
        else:
            lines.append(current_line.strip())
            current_line = word + " "
    if current_line:
        lines.append(current_line.strip())
    return lines

def distort_text(text):
    glitched = ""
    for char in text:
        if random.random() < 0.05 and char not in ["\n", " "]:
            glitched += random.choice(string.ascii_letters + "!?@#$%^&*")
        else:
            glitched += char
    return glitched

def draw_message_box(text):
    box_rect = pygame.Rect(50, HEIGHT - 150, WIDTH - 100, 100)
    if hallucination_active:
        box_rect.move_ip(random.randint(-3, 3), random.randint(-2, 2))
    pygame.draw.rect(screen, (30, 30, 30), box_rect)
    pygame.draw.rect(screen, (100, 0, 0), box_rect, 2)

    wrapped_lines = wrap_text(text, font, box_rect.width - 20)
    for i, line in enumerate(wrapped_lines):
        display = distort_text(line) if hallucination_active else line
        rendered = font.render(display, True, (220, 220, 220))
        screen.blit(rendered, (box_rect.x + 10, box_rect.y + 10 + i * 30))

def draw_hallucination_overlay():
    if hallucination_active:
        overlay = pygame.Surface((WIDTH, HEIGHT))
        overlay.set_alpha(random.randint(20, 60))
        overlay.fill((120, 0, 0))
        screen.blit(overlay, (0, 0))
def check_true_ending_conditions():
    all_notes_read = all(note.get("read", False) for note in note_data.values())
    all_hallucinations_seen = all(hallucination_flags.values())
    return all_notes_read and all_hallucinations_seen

def handle_final_choice():
    global ending_chosen
    if ending_chosen:
        return
    ending_chosen = True
    if check_true_ending_conditions():
        trigger_true_ending()
    else:
        show_choices(["記憶を受け入れる", "記憶を閉じ込める"])

def trigger_acceptance_ending():
    fade_to_white()
    show_text_sequence([
        "あなたはすべてを思い出した。",
        "痛みも、後悔も、愛しさも。",
        "“彼”は、あなたの中にいた。",
        "そして今、ようやく――",
        "記憶は、静かに眠りにつく。"
    ])
    show_credits("Ending A：解放")

def trigger_denial_ending():
    fade_to_black()
    show_text_sequence([
        "あなたは目を背けた。",
        "記憶は再び閉ざされ、館に封じられる。",
        "“彼”は、またひとりになった。",
        "…いや、今度はふたりで。"
    ])
    show_credits("Ending B：永劫")

def trigger_true_ending():
    fade_to_white()
    show_text_sequence([
        "あなたはすべてを見た。",
        "記録も、道具も、幻も。",
        "それは、誰かの記憶ではなく――",
        "あなた自身のものだった。",
        "ようやく、歩き出せる。"
    ])
    show_credits("Ending C：回帰")
def show_message(text):
    print(f"[MESSAGE] {text}")  # 実際は画面に表示

def show_text_sequence(lines):
    for line in lines:
        show_message(line)
        pygame.time.wait(2000)

def show_credits(title):
    screen.fill((0, 0, 0))
    credit = title_font.render(title, True, (255, 255, 255))
    screen.blit(credit, (WIDTH//2 - credit.get_width()//2, HEIGHT//2))
    pygame.display.flip()
    pygame.time.wait(3000)

def fade_to_white():
    screen.fill((255, 255, 255))
    pygame.display.flip()
    pygame.time.wait(1000)

def fade_to_black():
    screen.fill((0, 0, 0))
    pygame.display.flip()
    pygame.time.wait(1000)
