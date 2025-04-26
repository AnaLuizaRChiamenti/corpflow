import Image from "next/image";
import Link from "next/link";
import "../../css/dashboard.css"; 

export default function Dashboard() {
  return (
    <>
      <div className="sidebar">
        <Image
          src="https://i.postimg.cc/W1xNjHP7/corpflow.png"
          alt="CorpFlow Logo"
          className="logo"
          width={100}
          height={100}
        />
        <div className="section">
          <h3>Blocos disponíveis</h3>
          <div className="block-section">
            <button className="concluida">Concluída</button>
          </div>
        </div>

        <div className="section">
          <h3>Tarefas concluídas</h3>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="dropdown">
            <button className="dropdown-button">
              <span>Welcome, Marta</span>
              <div className="avatar">MA</div>
            </button>

            <div className="dropdown-content">
              <Link href="#">
                <Image
                  src="https://img.icons8.com/material-outlined/24/000000/user.png"
                  alt="Profile Icon"
                  width={24}
                  height={24}
                />
                Marta<br />Employee
              </Link>
              <Link href="#">
                <Image
                  src="https://img.icons8.com/material-outlined/24/000000/logout-rounded.png"
                  alt="Logout Icon"
                  width={24}
                  height={24}
                />
                Logout
              </Link>
            </div>
          </div>
        </div>

        <div className="task-section">
          <h2>Minhas tarefas</h2>
        </div>
      </div>
    </>
  );
}
